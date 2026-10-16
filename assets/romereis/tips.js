/* Romereis Sint Ursula 2026 — pagina "Tips en Tricks".
   Voeg gerust restaurantjes en andere aanraders toe: een regel in 'items' is genoeg.
     naam  : naam van de plek of de tip
     tekst : korte uitleg (waarom aanrader, ongeveer wat het kost, waar)
     coord : [breedtegraad, lengtegraad] (optioneel; geeft kaartknoppen)
   Zet GEEN persoonlijke gegevens in dit bestand (geen namen, telefoonnummers of e-mailadressen):
   de pagina is openbaar. */
window.ROMEREIS_TIPS = [
  { titel: 'Restaurants en pizzeria’s',
    intro: 'Vermijd de meest toeristische plekken (o.a. Piazza Navona en rond het Pantheon): daar betaal je veel voor weinig. Zoek zijstraten op, kijk waar Romeinen zelf zitten.',
    items: [] },
  { titel: 'Koffie en ijs',
    items: [
      { naam: 'Tazza d’Oro', tekst: 'De beste koffie van Rome, vlak bij het Pantheon.', coord: [41.8987, 12.4775] },
      { naam: 'Giolitti', tekst: 'Het beste ijsje van Rome, een klassieker vlak bij het Pantheon.', coord: [41.9002, 12.4767] }
    ] },
  { titel: 'Lunchen zonder blut te raken',
    items: [
      { naam: 'Bakker, kruidenier of supermarkt', tekst: 'Koop brood en beleg en een fles gekoeld water; dat is goedkoop en lekker.' },
      { naam: 'Een stuk pizza', tekst: 'Pizza al taglio (per stuk) koop je bij een bakkerij of pizzeria en eet je rustig ergens buiten op, bijvoorbeeld bij het Circus Maximus of op de Aventijn.' },
      { naam: 'Niet op een terras', tekst: 'Zitten in een restaurant of op een terrasje midden op de dag kost veel tot extreem veel geld.' }
    ] },
  { titel: 'Slim in een bar',
    items: [
      { naam: 'Eerst betalen, dan bestellen', tekst: 'In een bar betaal je eerst aan de kassa, daarna bestel je met je bonnetje aan de bar. Laat eventueel een fooi (ong. € 0,10) achter in het potje.' },
      { naam: 'Staan is het goedkoopst', tekst: 'Staand aan de bar betaal je het minst, zitten binnen kost meer en op het terras betaal je het meest.' }
    ] },
  { titel: 'Slim reizen',
    items: [
      { naam: 'Zakkenrollers', tekst: 'Vooral in drukke bussen, bij de Trevifontein, in metro en op toeristische plekken. Houd je tas voor je en je telefoon op zak.' },
      { naam: 'Kleding in kerken', tekst: 'Schouders en knieën bedekt in de kerken. Doe een lichte trui of sjaal in je tas.' },
      { naam: 'Siesta', tekst: 'Winkels zijn vaak gesloten van 13.00 tot 16.00/16.30 uur. Plan je rustpauze dan.' },
      { naam: 'Stilzitverbod', tekst: 'Op de Spaanse Trappen en de trappen van het monument van Victor Emanuel II mag je niet zitten, eten of drinken. Boetes zijn voor eigen rekening.' }
    ] }
];
