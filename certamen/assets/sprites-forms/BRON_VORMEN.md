# Bron: alle vormen en helden van Castra Heroum (voor het genereren van beeldprompts)

Uit het spel gehaald op 2026-12-12 (`CASTRA_FORM_LIST`, `CASTRA_FOLKS`, `CASTRA_HERO_DATA`): 151 vormen in 12 groepen en 15 helden.
Per regel: **vorm-id** (bestandsnaam, kleine letters) | Latijnse naam | tier (1 = rekruut, 4 = hoogste) | tak | rol | ontwikkelt uit.
Rollen: rekruut, infanterie, afstand/boog/werpers, cavalerie/rijdieren/strijdwagens, support/genezer/ingenieur/standaarddrager, mythisch wezen.
Hogere tier = zichtbaar beter uitgerust (meer en rijker pantser, mooiere helm, sieraden), nooit een ander uiterlijk van hoofdkleur.
De accentkleur van de cape is de herkenningskleur van het volk en moet in elke vorm van dat volk sterk aanwezig zijn.

## Romeinen (volkscode rom)  — accentkleur cape: rood; standaardlook: huid licht, haar kort zwart; regio: latium
- rom_tiro | Tiro | tier 1 | tak: Rekruut | rol: rekruut
- rom_hastatus | Hastatus | tier 2 | tak: Infanterie | rol: infanterie | ontwikkelt uit: Tiro
- rom_princeps | Princeps | tier 3 | tak: Infanterie | rol: infanterie | ontwikkelt uit: Hastatus
- rom_triarius | Triarius | tier 4 | tak: Infanterie | rol: infanterie | ontwikkelt uit: Princeps
- rom_optio | Optio | tier 3 | tak: Infanterie | rol: infanterie | ontwikkelt uit: Hastatus
- rom_centurio | Centurio | tier 4 | tak: Infanterie | rol: infanterie | ontwikkelt uit: Optio
- rom_signifer | Signifer | tier 3 | tak: Infanterie | rol: support/genezer/ingenieur/standaarddrager | ontwikkelt uit: Hastatus
- rom_aquilifer | Aquilifer | tier 4 | tak: Infanterie | rol: support/genezer/ingenieur/standaarddrager | ontwikkelt uit: Signifer
- rom_veles | Veles | tier 2 | tak: Licht en afstand | rol: afstand/boog/werpers | ontwikkelt uit: Tiro
- rom_funditor | Funditor | tier 3 | tak: Licht en afstand | rol: afstand/boog/werpers | ontwikkelt uit: Veles
- rom_sagittarius | Sagittarius | tier 4 | tak: Licht en afstand | rol: afstand/boog/werpers | ontwikkelt uit: Funditor
- rom_explorator | Explorator | tier 3 | tak: Licht en afstand | rol: afstand/boog/werpers | ontwikkelt uit: Veles
- rom_speculator | Speculator | tier 4 | tak: Licht en afstand | rol: afstand/boog/werpers | ontwikkelt uit: Explorator
- rom_eques | Eques | tier 2 | tak: Ruiterij | rol: cavalerie/rijdieren/strijdwagens | ontwikkelt uit: Tiro
- rom_decurio | Decurio | tier 3 | tak: Ruiterij | rol: cavalerie/rijdieren/strijdwagens | ontwikkelt uit: Eques
- rom_praefectusalae | Praefectus alae | tier 4 | tak: Ruiterij | rol: cavalerie/rijdieren/strijdwagens | ontwikkelt uit: Decurio
- rom_faber | Faber | tier 2 | tak: Technisch | rol: support/genezer/ingenieur/standaarddrager | ontwikkelt uit: Tiro
- rom_ballistarius | Ballistarius | tier 3 | tak: Technisch | rol: afstand/boog/werpers | ontwikkelt uit: Faber
- rom_architectus | Architectus | tier 4 | tak: Technisch | rol: afstand/boog/werpers | ontwikkelt uit: Ballistarius
- rom_capsarius | Capsarius | tier 3 | tak: Technisch | rol: support/genezer/ingenieur/standaarddrager | ontwikkelt uit: Faber
- rom_medicus | Medicus | tier 4 | tak: Technisch | rol: support/genezer/ingenieur/standaarddrager | ontwikkelt uit: Capsarius
- rom_remex | Remex | tier 2 | tak: Vloot | rol: infanterie | ontwikkelt uit: Tiro
- rom_classiarius | Classiarius | tier 3 | tak: Vloot | rol: infanterie | ontwikkelt uit: Remex
- rom_navarchus | Navarchus | tier 4 | tak: Vloot | rol: infanterie | ontwikkelt uit: Classiarius

## Grieken (volkscode gra)  — accentkleur cape: blauw; standaardlook: huid getint, haar middel bruin; regio: graecia
- gra_ephebus | Ephebus | tier 1 | tak: Rekruut | rol: rekruut
- gra_hoplites | Hoplites | tier 2 | tak: Infanterie | rol: infanterie | ontwikkelt uit: Ephebus
- gra_epilectus | Epilectus | tier 3 | tak: Infanterie | rol: infanterie | ontwikkelt uit: Hoplites
- gra_lochagus | Lochagus | tier 4 | tak: Infanterie | rol: infanterie | ontwikkelt uit: Epilectus
- gra_psilus | Psilus | tier 2 | tak: Licht en afstand | rol: afstand/boog/werpers | ontwikkelt uit: Ephebus
- gra_peltasta | Peltasta | tier 3 | tak: Licht en afstand | rol: afstand/boog/werpers | ontwikkelt uit: Psilus
- gra_toxota | Toxota | tier 3 | tak: Licht en afstand | rol: afstand/boog/werpers | ontwikkelt uit: Psilus
- gra_toxotacretensis | Toxota Cretensis | tier 4 | tak: Licht en afstand | rol: afstand/boog/werpers | ontwikkelt uit: Toxota
- gra_hippeus | Hippeus | tier 2 | tak: Ruiterij | rol: cavalerie/rijdieren/strijdwagens | ontwikkelt uit: Ephebus
- gra_prodromus | Prodromus | tier 3 | tak: Ruiterij | rol: cavalerie/rijdieren/strijdwagens | ontwikkelt uit: Hippeus
- gra_hetairus | Hetairus | tier 4 | tak: Ruiterij | rol: cavalerie/rijdieren/strijdwagens | ontwikkelt uit: Prodromus
- gra_hippotoxota | Hippotoxota | tier 3 | tak: Ruiterij | rol: cavalerie/rijdieren/strijdwagens | ontwikkelt uit: Hippeus

## Spartanen (volkscode spa)  — accentkleur cape: rood; standaardlook: huid getint, haar lang zwart; regio: graecia
- spa_puerlaco | Puer Laco | tier 1 | tak: Rekruut | rol: rekruut
- spa_spartiates | Spartiates | tier 2 | tak: Infanterie | rol: infanterie | ontwikkelt uit: Puer Laco
- spa_trecentus | Trecentus | tier 3 | tak: Infanterie | rol: infanterie | ontwikkelt uit: Spartiates
- spa_polemarchus | Polemarchus | tier 4 | tak: Infanterie | rol: infanterie | ontwikkelt uit: Trecentus
- spa_perioecus | Perioecus | tier 2 | tak: Licht en verkenning | rol: afstand/boog/werpers | ontwikkelt uit: Puer Laco
- spa_sciritas | Sciritas | tier 3 | tak: Licht en verkenning | rol: afstand/boog/werpers | ontwikkelt uit: Perioecus

## Trojanen (volkscode tro)  — accentkleur cape: paars; standaardlook: huid licht, haar kort bruin; regio: troia
- tro_tirotroianus | Tiro Troianus | tier 1 | tak: Rekruut | rol: rekruut
- tro_hastifer | Hastifer | tier 2 | tak: Infanterie | rol: infanterie | ontwikkelt uit: Tiro Troianus
- tro_propugnator | Propugnator | tier 3 | tak: Infanterie | rol: infanterie | ontwikkelt uit: Hastifer
- tro_custospergami | Custos Pergami | tier 4 | tak: Infanterie | rol: infanterie | ontwikkelt uit: Propugnator
- tro_custosportae | Custos portae | tier 3 | tak: Infanterie | rol: infanterie | ontwikkelt uit: Hastifer
- tro_sagittariustroia | Sagittarius Troianus | tier 2 | tak: Afstand | rol: afstand/boog/werpers | ontwikkelt uit: Tiro Troianus
- tro_sagittariuslyciu | Sagittarius Lycius | tier 3 | tak: Afstand | rol: afstand/boog/werpers | ontwikkelt uit: Sagittarius Troianus
- tro_auriga | Auriga | tier 2 | tak: Strijdwagens | rol: cavalerie/rijdieren/strijdwagens | ontwikkelt uit: Tiro Troianus
- tro_bellatorcurru | Bellator curru | tier 3 | tak: Strijdwagens | rol: cavalerie/rijdieren/strijdwagens | ontwikkelt uit: Auriga
- tro_ministertempli | Minister templi | tier 2 | tak: Priesters | rol: support/genezer/ingenieur/standaarddrager | ontwikkelt uit: Tiro Troianus
- tro_sacerdosapollini | Sacerdos Apollinis | tier 3 | tak: Priesters | rol: support/genezer/ingenieur/standaarddrager | ontwikkelt uit: Minister templi
- tro_vates | Vates | tier 4 | tak: Priesters | rol: support/genezer/ingenieur/standaarddrager | ontwikkelt uit: Sacerdos Apollinis

## Gladiatoren (volkscode gla)  — accentkleur cape: oranje; standaardlook: huid olijf, haar wild bruin; regio: roma
- gla_novicius | Novicius | tier 1 | tak: Rekruut | rol: rekruut
- gla_murmillo | Murmillo | tier 2 | tak: Zwaar | rol: infanterie | ontwikkelt uit: Novicius
- gla_secutor | Secutor | tier 2 | tak: Zwaar | rol: infanterie | ontwikkelt uit: Novicius
- gla_hoplomachus | Hoplomachus | tier 2 | tak: Zwaar | rol: infanterie | ontwikkelt uit: Novicius
- gla_retiarius | Retiarius | tier 2 | tak: Licht | rol: afstand/boog/werpers | ontwikkelt uit: Novicius
- gla_thraex | Thraex | tier 2 | tak: Licht | rol: infanterie | ontwikkelt uit: Novicius
- gla_dimachaerus | Dimachaerus | tier 2 | tak: Licht | rol: infanterie | ontwikkelt uit: Novicius
- gla_primuspalus | Primus palus | tier 3 | tak: Zwaar en licht | rol: infanterie | ontwikkelt uit: Murmillo, Secutor, Hoplomachus, Retiarius, Thraex, Dimachaerus
- gla_essedarius | Essedarius | tier 2 | tak: Wagen | rol: cavalerie/rijdieren/strijdwagens | ontwikkelt uit: Novicius
- gla_rudiarius | Rudiarius | tier 3 | tak: Veteraan | rol: support/genezer/ingenieur/standaarddrager | ontwikkelt uit: Murmillo, Secutor, Hoplomachus, Retiarius, Thraex, Dimachaerus

## Galliërs (volkscode gal)  — accentkleur cape: groen; standaardlook: huid zeerlicht, haar wild blond; regio: gallia
- gal_iuvenisgallus | Iuvenis Gallus | tier 1 | tak: Rekruut | rol: rekruut
- gal_gaesatus | Gaesatus | tier 2 | tak: Infanterie | rol: infanterie | ontwikkelt uit: Iuvenis Gallus
- gal_bellatorgallus | Bellator Gallus | tier 3 | tak: Infanterie | rol: infanterie | ontwikkelt uit: Gaesatus
- gal_soldurius | Soldurius | tier 4 | tak: Infanterie | rol: infanterie | ontwikkelt uit: Bellator Gallus
- gal_equesgallus | Eques Gallus | tier 2 | tak: Ruiterij | rol: cavalerie/rijdieren/strijdwagens | ontwikkelt uit: Iuvenis Gallus
- gal_equesnobilis | Eques nobilis | tier 3 | tak: Ruiterij | rol: cavalerie/rijdieren/strijdwagens | ontwikkelt uit: Eques Gallus
- gal_bardus | Bardus | tier 2 | tak: Druïden | rol: support/genezer/ingenieur/standaarddrager | ontwikkelt uit: Iuvenis Gallus
- gal_druida | Druida | tier 3 | tak: Druïden | rol: support/genezer/ingenieur/standaarddrager | ontwikkelt uit: Bardus
- gal_summusdruida | Summus druida | tier 4 | tak: Druïden | rol: support/genezer/ingenieur/standaarddrager | ontwikkelt uit: Druida

## Germanen (volkscode ger)  — accentkleur cape: groen; standaardlook: huid zeerlicht, haar lang blond; regio: germania
- ger_iuvenisgermanus | Iuvenis Germanus | tier 1 | tak: Rekruut | rol: rekruut
- ger_frameatus | Frameatus | tier 2 | tak: Infanterie | rol: infanterie | ontwikkelt uit: Iuvenis Germanus
- ger_centenus | Centenus | tier 3 | tak: Infanterie | rol: infanterie | ontwikkelt uit: Frameatus
- ger_comes | Comes | tier 4 | tak: Infanterie | rol: infanterie | ontwikkelt uit: Centenus
- ger_equesgermanus | Eques Germanus | tier 2 | tak: Ruiterij | rol: cavalerie/rijdieren/strijdwagens | ontwikkelt uit: Iuvenis Germanus
- ger_batavus | Batavus | tier 3 | tak: Ruiterij | rol: cavalerie/rijdieren/strijdwagens | ontwikkelt uit: Eques Germanus
- ger_saga | Saga | tier 2 | tak: Zieneressen | rol: support/genezer/ingenieur/standaarddrager | ontwikkelt uit: Iuvenis Germanus
- ger_vatesgermana | Vates Germana | tier 3 | tak: Zieneressen | rol: support/genezer/ingenieur/standaarddrager | ontwikkelt uit: Saga

## Egyptenaren (volkscode aeg)  — accentkleur cape: goud; standaardlook: huid brons, haar kort zwart; regio: aegyptus
- aeg_iuvenisaegyptius | Iuvenis Aegyptius | tier 1 | tak: Rekruut | rol: rekruut
- aeg_machimus | Machimus | tier 2 | tak: Infanterie | rol: infanterie | ontwikkelt uit: Iuvenis Aegyptius
- aeg_satelles | Satelles | tier 3 | tak: Infanterie | rol: infanterie | ontwikkelt uit: Machimus
- aeg_custospharaonis | Custos Pharaonis | tier 4 | tak: Infanterie | rol: infanterie | ontwikkelt uit: Satelles
- aeg_sagittariusaegyp | Sagittarius Aegyptius | tier 2 | tak: Afstand | rol: afstand/boog/werpers | ontwikkelt uit: Iuvenis Aegyptius
- aeg_sagittariusnubiu | Sagittarius Nubius | tier 3 | tak: Afstand | rol: afstand/boog/werpers | ontwikkelt uit: Sagittarius Aegyptius
- aeg_aurigaaegyptius | Auriga Aegyptius | tier 2 | tak: Strijdwagens | rol: cavalerie/rijdieren/strijdwagens | ontwikkelt uit: Iuvenis Aegyptius
- aeg_bellatorcurruaeg | Bellator curru Aegyptius | tier 3 | tak: Strijdwagens | rol: cavalerie/rijdieren/strijdwagens | ontwikkelt uit: Auriga Aegyptius
- aeg_scriba | Scriba | tier 2 | tak: Priesters | rol: support/genezer/ingenieur/standaarddrager | ontwikkelt uit: Iuvenis Aegyptius
- aeg_sacerdosisidis | Sacerdos Isidis | tier 3 | tak: Priesters | rol: support/genezer/ingenieur/standaarddrager | ontwikkelt uit: Scriba

## Perzen (volkscode per)  — accentkleur cape: paars; standaardlook: huid olijf, haar kort zwart; regio: persis
- per_iuvenispersa | Iuvenis Persa | tier 1 | tak: Rekruut | rol: rekruut
- per_sparabara | Sparabara | tier 2 | tak: Infanterie | rol: infanterie | ontwikkelt uit: Iuvenis Persa
- per_immortalis | Immortalis | tier 3 | tak: Infanterie | rol: infanterie | ontwikkelt uit: Sparabara
- per_melophorus | Melophorus | tier 4 | tak: Infanterie | rol: infanterie | ontwikkelt uit: Immortalis
- per_sagittariuspersa | Sagittarius Persa | tier 2 | tak: Afstand | rol: afstand/boog/werpers | ontwikkelt uit: Iuvenis Persa
- per_sagittariusscyth | Sagittarius Scytha | tier 3 | tak: Afstand | rol: afstand/boog/werpers | ontwikkelt uit: Sagittarius Persa
- per_equespersa | Eques Persa | tier 2 | tak: Ruiterij | rol: cavalerie/rijdieren/strijdwagens | ontwikkelt uit: Iuvenis Persa
- per_cataphractus | Cataphractus | tier 3 | tak: Ruiterij | rol: cavalerie/rijdieren/strijdwagens | ontwikkelt uit: Eques Persa
- per_clibanarius | Clibanarius | tier 4 | tak: Ruiterij | rol: cavalerie/rijdieren/strijdwagens | ontwikkelt uit: Cataphractus
- per_magus | Magus | tier 2 | tak: Magiërs | rol: support/genezer/ingenieur/standaarddrager | ontwikkelt uit: Iuvenis Persa
- per_archimagus | Archimagus | tier 3 | tak: Magiërs | rol: support/genezer/ingenieur/standaarddrager | ontwikkelt uit: Magus

## Carthagers (volkscode car)  — accentkleur cape: oranje; standaardlook: huid brons, haar kort zwart; regio: africa
- car_iuvenispoenus | Iuvenis Poenus | tier 1 | tak: Rekruut | rol: rekruut
- car_libyus | Libyus | tier 2 | tak: Infanterie | rol: infanterie | ontwikkelt uit: Iuvenis Poenus
- car_veteranuslibyus | Veteranus Libyus | tier 3 | tak: Infanterie | rol: infanterie | ontwikkelt uit: Libyus
- car_milessacer | Miles sacer | tier 4 | tak: Infanterie | rol: infanterie | ontwikkelt uit: Veteranus Libyus
- car_funditorbalearic | Funditor Balearicus | tier 2 | tak: Afstand | rol: afstand/boog/werpers | ontwikkelt uit: Iuvenis Poenus
- car_equesnumida | Eques Numida | tier 2 | tak: Ruiterij | rol: cavalerie/rijdieren/strijdwagens | ontwikkelt uit: Iuvenis Poenus
- car_numidanobilis | Numida nobilis | tier 3 | tak: Ruiterij | rol: cavalerie/rijdieren/strijdwagens | ontwikkelt uit: Eques Numida
- car_rectorelephanti | Rector elephanti | tier 2 | tak: Olifanten | rol: cavalerie/rijdieren/strijdwagens | ontwikkelt uit: Iuvenis Poenus
- car_elephantusbellic | Elephantus bellicus | tier 3 | tak: Olifanten | rol: cavalerie/rijdieren/strijdwagens | ontwikkelt uit: Rector elephanti
- car_elephantusturrit | Elephantus turritus | tier 4 | tak: Olifanten | rol: cavalerie/rijdieren/strijdwagens | ontwikkelt uit: Elephantus bellicus

## Amazones (volkscode ama)  — accentkleur cape: groen; standaardlook: huid licht, haar vlecht rood; regio: themiscyra
- ama_virgoamazon | Virgo Amazon | tier 1 | tak: Rekruut | rol: rekruut
- ama_sagittaria | Sagittaria | tier 2 | tak: Afstand | rol: afstand/boog/werpers | ontwikkelt uit: Virgo Amazon
- ama_sagittariaequest | Sagittaria equestris | tier 3 | tak: Afstand | rol: cavalerie/rijdieren/strijdwagens | ontwikkelt uit: Sagittaria
- ama_peltastaamazon | Peltasta Amazon | tier 2 | tak: Infanterie | rol: afstand/boog/werpers | ontwikkelt uit: Virgo Amazon
- ama_securifera | Securifera | tier 3 | tak: Infanterie | rol: infanterie | ontwikkelt uit: Peltasta Amazon

## Mythische wezens (volkscode myt)  — geen volkskleur; dit zijn geen mensen maar wezens, elk met eigen uiterlijk; geen cape-accent
- myt_satyrus | Satyrus | tier 1 | tak: Saters | rol: mythisch wezen
- myt_silenus | Silenus | tier 2 | tak: Saters | rol: mythisch wezen | ontwikkelt uit: Satyrus
- myt_nympha | Nympha | tier 1 | tak: Nimfen | rol: mythisch wezen
- myt_dryas | Dryas | tier 2 | tak: Nimfen | rol: mythisch wezen | ontwikkelt uit: Nympha
- myt_naias | Naias | tier 2 | tak: Nimfen | rol: mythisch wezen | ontwikkelt uit: Nympha
- myt_oreas | Oreas | tier 2 | tak: Nimfen | rol: mythisch wezen | ontwikkelt uit: Nympha
- myt_nereis | Nereis | tier 2 | tak: Nimfen | rol: mythisch wezen | ontwikkelt uit: Nympha
- myt_pulluscentauri | Pullus centauri | tier 1 | tak: Centauren | rol: mythisch wezen
- myt_centaurus | Centaurus | tier 2 | tak: Centauren | rol: mythisch wezen | ontwikkelt uit: Pullus centauri
- myt_centaurussagitta | Centaurus sagittarius | tier 3 | tak: Centauren | rol: mythisch wezen | ontwikkelt uit: Centaurus
- myt_harpyia | Harpyia | tier 1 | tak: Harpijen | rol: mythisch wezen
- myt_pullusgrypis | Pullus grypis | tier 1 | tak: Grijpvogels | rol: mythisch wezen
- myt_gryps | Gryps | tier 2 | tak: Grijpvogels | rol: mythisch wezen | ontwikkelt uit: Pullus grypis
- myt_siren | Siren | tier 1 | tak: Sirenen | rol: mythisch wezen
- myt_cyclopspastor | Cyclops pastor | tier 1 | tak: Cyclopen | rol: mythisch wezen
- myt_cyclopsfaber | Cyclops faber | tier 2 | tak: Cyclopen | rol: mythisch wezen | ontwikkelt uit: Cyclops pastor
- myt_hippocampus | Hippocampus | tier 1 | tak: Zeepaarden | rol: mythisch wezen
- myt_umbra | Umbra | tier 1 | tak: Schimmen | rol: mythisch wezen
- myt_lemur | Lemur | tier 2 | tak: Schimmen | rol: mythisch wezen | ontwikkelt uit: Umbra
- myt_larva | Larva | tier 3 | tak: Schimmen | rol: mythisch wezen | ontwikkelt uit: Lemur
- myt_formica | Formica | tier 1 | tak: Myrmidonen | rol: mythisch wezen
- myt_myrmido | Myrmido | tier 2 | tak: Myrmidonen | rol: mythisch wezen | ontwikkelt uit: Formica
- myt_densdraconis | Dens draconis | tier 1 | tak: Gezaaide mannen | rol: mythisch wezen
- myt_spartus | Spartus | tier 2 | tak: Gezaaide mannen | rol: mythisch wezen | ontwikkelt uit: Dens draconis
- myt_anguis | Anguis | tier 1 | tak: Draken | rol: mythisch wezen
- myt_serpens | Serpens | tier 2 | tak: Draken | rol: mythisch wezen | ontwikkelt uit: Anguis
- myt_draco | Draco | tier 3 | tak: Draken | rol: mythisch wezen | ontwikkelt uit: Serpens
- myt_pullusalatus | Pullus alatus | tier 1 | tak: Gevleugelde paarden | rol: mythisch wezen
- myt_equusalatus | Equus alatus | tier 2 | tak: Gevleugelde paarden | rol: mythisch wezen | ontwikkelt uit: Pullus alatus
- myt_phoenix | Phoenix | tier 1 | tak: Feniks | rol: mythisch wezen
- myt_lupus | Lupus | tier 1 | tak: Wolven van Mars | rol: mythisch wezen
- myt_lupusmartius | Lupus Martius | tier 2 | tak: Wolven van Mars | rol: mythisch wezen | ontwikkelt uit: Lupus
- myt_aquila | Aquila | tier 1 | tak: Adelaars van Jupiter | rol: mythisch wezen
- myt_aquilaiovis | Aquila Iovis | tier 2 | tak: Adelaars van Jupiter | rol: mythisch wezen | ontwikkelt uit: Aquila

## HELDEN (15) — elk krijgt een portret (verplicht) en een blad A en B zoals de vormen
- hero_aeneas | Aeneas | rol: infanterie | regio: latium | look: huid getint, haar kort bruin, baard baard, armor ceremonieel, cape lang rood, helm geen, schild geen, wapen zwaard
- hero_romulus | Romulus | rol: infanterie | regio: latium | look: huid licht, haar wild zwart, armor ceremonieel, cape kort rood, helm geen, schild geen, wapen zwaard
- hero_horatius | Horatius Cocles | rol: infanterie | regio: latium | look: huid olijf, haar kort zwart, baard snor, armor middel, cape kort rood, helm open, schild geen, wapen zwaard
- hero_cloelia | Cloelia | rol: cavalerie/rijdieren/strijdwagens | regio: latium | look: huid licht, haar vlecht bruin, armor robe, cape kort blauw, helm geen, schild geen, wapen zwaard
- hero_mucius | Mucius Scaevola | rol: infanterie | regio: latium | look: huid getint, haar kort zwart, baard sikensnor, armor middel, cape lang groen, helm bandana, schild geen, wapen zwaard
- hero_camilla | Camilla | rol: afstand/boog/werpers | regio: latium | look: huid olijf, haar lang zwart, armor vodden, cape lang groen, helm bandana, schild geen, wapen zwaard
- hero_hercules | Hercules | rol: infanterie | regio: graecia | look: huid brons, haar wild bruin, baard baard, armor vodden, cape lang oranje, helm geen, schild geen, wapen zwaard
- hero_perseus | Perseus | rol: cavalerie/rijdieren/strijdwagens | regio: graecia | look: huid licht, haar hanekam blond, armor ceremonieel, cape engelenvleugels rood, helm geen, schild geen, wapen zwaard
- hero_theseus | Theseus | rol: infanterie | regio: graecia | look: huid licht, haar middel bruin, armor ceremonieel, cape kort blauw, helm geen, schild geen, wapen zwaard
- hero_atalanta | Atalanta | rol: afstand/boog/werpers | regio: graecia | look: huid olijf, haar vlecht bruin, armor vodden, cape kort groen, helm bandana, schild geen, wapen zwaard
- hero_iason | Iason | rol: infanterie | regio: graecia | look: huid getint, haar kort blond, armor middel, cape kort goud, helm open, schild geen, wapen zwaard
- hero_achilles | Achilles | rol: infanterie | regio: troia | look: huid licht, haar middel blond, armor ceremonieel, cape kort rood, helm open, schild geen, wapen zwaard
- hero_hector | Hector | rol: infanterie | regio: troia | look: huid getint, haar kort zwart, baard baard, armor middel, cape lang blauw, helm open, schild geen, wapen zwaard
- hero_ulixes | Ulixes | rol: support/genezer/ingenieur/standaarddrager | regio: troia | look: huid olijf, haar kort bruin, baard baard, armor robe, cape kort groen, helm standard, schild geen, wapen zwaard
- hero_penthesilea | Penthesilea | rol: afstand/boog/werpers | regio: troia | look: huid licht, haar lang rood, armor middel, cape lang paars, helm geen, schild geen, wapen zwaard

(De "look"-velden van de helden zijn de bestaande avatar-instellingen in het spel; de wapen-aanduiding is overal "zwaard", maar de held mag een eigen passend wapen krijgen: Hercules een knots, Atalanta/Camilla/Penthesilea een boog of speer, Achilles een speer, Perseus een kromzwaard en een gevleugelde sandaal.)
