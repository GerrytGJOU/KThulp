/* Romereis 2026 — lijst van afbeeldingen.
   Zet een plaatje in de map van de bijbehorende plek (assets/romereis/<plek>/) met exact de
   bestandsnaam hieronder; de app toont het dan vanzelf. Bestaat een bestand (nog) niet, dan
   wordt het stilletjes overgeslagen. Meer plaatjes? Voeg gewoon een regel toe.
     bestand : bestandsnaam in de map van de plek
     titel   : bijschrift
     type    : 'kaart' (komt onder "Plattegrond & kaart") of 'foto' (onder "Afbeeldingen")
     bron    : herkomst/rechthebbende (komt onder het plaatje)
   De sleutel 'algemeen' (map algemeen/) en 'kaarten' (map kaarten/) tonen op elke dag
   (algemeen bij 'foto', kaarten bij 'kaart'). */
window.ROMEREIS_AFBEELDINGEN = {
  'kaarten': [
    { bestand: 'plattegrond-rome.png',      titel: 'Plattegrond van Rome', type: 'kaart', bron: '' },
    { bestand: 'zeven-heuvels.jpg',         titel: 'De zeven heuvels van Rome', type: 'kaart', bron: '' },
    { bestand: 'muren-van-rome.webp',       titel: 'De Servische en Aureliaanse muur', type: 'kaart', bron: '' },
    { bestand: 'metro-rome.png',            titel: 'Metrokaart van Rome', type: 'kaart', bron: '' }
  ],
  'algemeen': [
    { bestand: 'antiek-rome-bovenaanzicht.jpg', titel: 'Reconstructie van het antieke Rome van bovenaf', type: 'foto', bron: '' }
  ],
  'forum-romanum': [
    { bestand: 'plattegrond-forum.jpg',     titel: 'Plattegrond van het Forum Romanum', type: 'kaart', bron: '' },
    { bestand: 'plattegrond-forum-2.png',   titel: 'Artistieke plattegrond: Colosseum, Forum en omgeving', type: 'kaart', bron: '' },
    { bestand: 'forum-1.jpg',               titel: 'Het Forum Romanum', type: 'foto', bron: '' }
  ],
  'keizersfora': [
    { bestand: 'plattegrond-keizersfora.jpg', titel: 'Plattegrond van de Keizersfora', type: 'kaart', bron: '' },
    { bestand: 'zuil-van-trajanus.jpg',     titel: 'De Zuil van Trajanus', type: 'foto', bron: '' }
  ],
  'palatijn': [
    { bestand: 'plattegrond-palatijn.jpg',  titel: 'Plattegrond van de Palatijn', type: 'kaart', bron: '' },
    { bestand: 'palatijn-1.jpg',            titel: 'De Palatijn', type: 'foto', bron: '' }
  ],
  'colosseum': [
    { bestand: 'colosseum-golvin.jpg',      titel: 'Reconstructie van het Colosseum in gebruik (J.-C. Golvin)', type: 'foto', bron: 'J.-C. Golvin' },
    { bestand: 'colossus-nero.jpg',         titel: 'Reconstructie van de Colossus naast het Colosseum in aanbouw', type: 'foto', bron: '' },
    { bestand: 'colosseum-1.jpg',           titel: 'Het Colosseum', type: 'foto', bron: '' }
  ],
  'circus-maximus': [
    { bestand: 'model-circus-maximus.jpg',  titel: 'Model van het Circus Maximus in het oude Rome', type: 'foto', bron: '' }
  ],
  'pantheon': [
    { bestand: 'pantheon-1.jpg',            titel: 'Het Pantheon', type: 'foto', bron: '' },
    { bestand: 'pantheon-oculus.jpg',       titel: 'De oculus van het Pantheon', type: 'foto', bron: '' }
  ],
  'castel-santangelo': [
    { bestand: 'mausoleum-golvin.jpg',      titel: 'Reconstructie van het Mausoleum van Hadrianus (J.-C. Golvin)', type: 'foto', bron: 'J.-C. Golvin' },
    { bestand: 'castel-santangelo-1.jpg',   titel: 'Castel Sant’Angelo', type: 'foto', bron: '' }
  ],
  'thermen-caracalla': [
    { bestand: 'thermen-caracalla-1.jpg',   titel: 'De Thermen van Caracalla', type: 'foto', bron: '' }
  ],
  'san-clemente': [
    { bestand: 'doorsnede-san-clemente.jpg', titel: 'Doorsnede: de drie lagen onder San Clemente', type: 'kaart', bron: '' },
    { bestand: 'mithras-relief.jpg',        titel: 'Mithras doodt de kosmische stier', type: 'foto', bron: '' },
    { bestand: 'apsismozaiek.jpg',          titel: 'Apsismozaïek: de Boom des Levens', type: 'foto', bron: '' }
  ],
  'santa-sabina': [
    { bestand: 'santa-sabina-1.jpg',        titel: 'Santa Sabina', type: 'foto', bron: '' }
  ],
  'santa-maria-maggiore': [
    { bestand: 'santa-maria-maggiore-1.jpg', titel: 'Santa Maria Maggiore', type: 'foto', bron: '' }
  ],
  'sint-pieter': [
    { bestand: 'circus-nero-vaticaan.jpg',  titel: 'Het Circus van Nero op de Vaticaanse heuvel', type: 'foto', bron: '' },
    { bestand: 'oude-sint-pieter.jpg',      titel: 'De eerste basiliek van Constantijn', type: 'foto', bron: '' },
    { bestand: 'sint-pieter-1.jpg',         titel: 'De Sint-Pieter', type: 'foto', bron: '' }
  ],
  'sint-jan': [
    { bestand: 'schip-sint-jan.jpg',        titel: 'Schip van Sint Jan van Lateranen', type: 'foto', bron: '' },
    { bestand: 'obelisk-lateranen.jpg',     titel: 'De Obelisk van Lateranen', type: 'foto', bron: '' }
  ],
  'quattro-coronati': [
    { bestand: 'quattro-coronati-1.jpg',    titel: 'Santi Quattro Coronati', type: 'foto', bron: '' }
  ],
  'santa-cecilia': [
    { bestand: 'santa-cecilia-1.jpg',       titel: 'Santa Cecilia in Trastevere', type: 'foto', bron: '' }
  ],
  'pompeii': [
    { bestand: 'plattegrond-pompeii.jpg',   titel: 'Plattegrond van Pompeii', type: 'kaart', bron: '' },
    { bestand: 'pompeii-forum.jpg',         titel: 'Het Forum van Pompeii met de Vesuvius', type: 'foto', bron: '' },
    { bestand: 'afgietsel.jpg',             titel: 'Gipsafgietsel van een slachtoffer', type: 'foto', bron: '' }
  ],
  'ostia-antica': [
    { bestand: 'ostia-antica-luchtfoto.jpg', titel: 'Luchtfoto van de opgravingen van Ostia Antica', type: 'foto', bron: '' }
  ],
  'trastevere': [
    { bestand: 'trastevere-1.jpg',          titel: 'Trastevere', type: 'foto', bron: '' }
  ],
  'centrum': [
    { bestand: 'spaanse-trappen.jpg',       titel: 'De Spaanse Trappen', type: 'foto', bron: '' },
    { bestand: 'trevifontein.jpg',          titel: 'De Trevifontein', type: 'foto', bron: '' }
  ],
  'vaticaanse-musea': [
    { bestand: 'vaticaanse-musea-1.jpg',    titel: 'Vaticaanse Musea', type: 'foto', bron: '' }
  ],
  'villa-borghese': [
    { bestand: 'villa-borghese-1.jpg',      titel: 'Villa Borghese', type: 'foto', bron: '' }
  ],
  'catacomben': [
    { bestand: 'catacomben-1.jpg',          titel: 'Catacomben', type: 'foto', bron: '' }
  ]
};
