/* Romereis Sint Ursula 2026 — pagina "Tips en Tricks".
   Voeg gerust restaurantjes en andere aanraders toe: een regel in 'items' is genoeg.
     naam   : naam van de plek of de tip
     tekst  : korte uitleg (waarom aanrader, ongeveer wat het kost, waar)
     adres  : straat + nummer (optioneel; geeft een Google Maps-knop)
     coord  : [breedtegraad, lengtegraad] (optioneel; geeft kaartknoppen)
     link   : website of Google Maps-link (optioneel; geeft een 'Meer info'-knop)
   Zet GEEN persoonlijke gegevens in dit bestand (geen namen van personen, telefoonnummers,
   e-mailadressen, hotelnamen of hoteladressen): de pagina is openbaar. */
window.ROMEREIS_TIPS = [
  { titel: 'Zo lees je deze lijst',
    intro: 'Prijsklassen: € = minder dan € 10 p.p. · €€ = ca. € 15–35 · €€€ = € 40 of meer. Openingstijden wisselen per bron: check ze vooraf op Google Maps. Trattoria’s zijn klein: ga in groepjes van maximaal 4 tot 6. Vermijd de meest toeristische plekken (o.a. Piazza Navona en rond het Pantheon): daar betaal je veel voor weinig. Let op het couvert (coperto) op de rekening.',
    items: [] },

  { titel: 'Eten bij de ruïnes',
    intro: 'Restaurants met een antiek verhaal: gebouwd op, naast of in monumenten.',
    items: [
      { naam: 'Da Pancrazio · €€', adres: 'Piazza del Biscione 92 (bij Campo de’ Fiori)', tekst: 'Gebouwd op de ruïnes van het Theater van Pompeius (1e eeuw v.Chr.), vlak bij de plek waar Caesar werd vermoord. Vraag om een tafel op de onderste verdieping (opus reticulatum). Buiten etenstijden mag je beleefd even binnen kijken.', link: 'https://www.reidsguides.com/italy/destinations/lazio/rome/sights/teatro_di_pompeo.html' },
      { naam: 'Hostaria Costanza · €€–€€€', adres: 'Piazza del Paradiso 65', tekst: 'De andere kant van hetzelfde Theater van Pompeius. Zondag gesloten. Reserveren aanbevolen.', link: 'http://www.hostariacostanza.it' },
      { naam: 'Flavio al Velavevodetto · €€', adres: 'Via di Monte Testaccio 97', tekst: 'Uitgehouwen in Monte Testaccio; door glazen wanden zie je de scherven van antieke olijfolie-amforen. Ca. € 20–40 voor twee gangen. Beste prijs/ruïne-verhouding.', link: 'https://www.timeout.com/rome/restaurants/flavio-al-velavevodetto' },
      { naam: 'Emma · €€', adres: 'Via del Monte della Farina 28 (bij Campo de’ Fiori en Largo Argentina)', tekst: 'Tip van de reisleiding: hier kun je ook ruïnes zien. Dunne, krokante Romeinse pizza met deeg van Roscioli (biologische bloem), plus gefrituurde starters zoals supplì en fiori di zucca. Pizza’s € 9–45, gemiddeld ca. € 35 p.p. Elke dag open voor lunch en diner, ook terras.', link: 'https://turismoroma.it/en/hospitality/emma-1' },
      { naam: 'Terre e Domus · €–€€', adres: 'Foro Traiano 82', tekst: 'Pal naast de Zuil van Trajanus (bellen voor een tafel met uitzicht). Ca. € 10–30.', link: 'https://www.sluurpy.it/roma/ristorante/42063/terre-e-domus' },
      { naam: 'Ristorante Traiano · €€€', adres: 'Foro Traiano 1B', tekst: 'In de Basilica Ulpia van het Forum van Trajanus: beneden muren en mozaïekvloeren uit de 2e eeuw. Maandag dicht; verder alleen ’s avonds, zaterdag ook lunch.', link: 'https://lavocedinewyork.com/en/news/2024/10/26/archeology-a-la-carte-in-rome-restaurants-for-ancient-history-buffs/' },
      { naam: 'Apuleius · €€€ (vooral voor docenten)', adres: 'Aventijn', tekst: 'Boven de resten van de Tempel van Diana, vol antieke artefacten, vernoemd naar de schrijver van de Metamorphoses. Reserveren verplicht; zondagavond en maandag dicht.', link: 'https://lavocedinewyork.com/en/news/2024/10/26/archeology-a-la-carte-in-rome-restaurants-for-ancient-history-buffs/' },
      { naam: 'Hostaria Antica Roma · €€€', adres: 'Via Appia Antica (taxi)', tekst: 'Menu met recepten van Apicius (patina cotidiana, pullum oxizomum met garum, tiropatina). De huidige tuin kijkt uit op het graf van Caecilia Metella.', link: 'https://lavocedinewyork.com/en/travel/2024/09/06/dining-near-the-catacombs-gastronomy-on-the-via-appia-antica/' },
      { naam: 'Ristorante Terme di Diocleziano · €€', adres: 'Bij Termini', tekst: 'In een ronde zaal van de Thermen van Diocletianus, met dakterras. Zon- en feestdagen dicht.' },
      { naam: 'Hostaria Da Nerone · €€', adres: 'Colle Oppio (bij het Colosseum en de Domus Aurea)', tekst: 'Trattoria sinds 1929, naast Nero’s Gouden Huis. Alleen lunch, zondag dicht.', link: 'https://www.gamberorosso.it/notizie/ristoranti/dove-mangiare-colosseo-roma-trattoria-da-nerone/' },
      { naam: 'Ba’Ghetto · €€–€€€', adres: 'Via del Portico d’Ottavia 57', tekst: 'Koosjer Joods-Romeins restaurant naast de Porticus Octaviae. Proefmenu’s € 40–50. Vrijdagavond en zaterdagmiddag dicht.', link: 'https://baghetto.com' },
      { naam: 'McDonald’s Roma Termini · €', adres: 'Station Termini', tekst: 'In de kelder lopen tufstenen blokken van de Serviaanse muur (6e eeuw v.Chr.).' }
    ] },

  { titel: 'Budget (€)',
    items: [
      { naam: 'Pastificio Guerra · €', adres: 'Via della Croce 8 (bij de Spaanse Trappen)', tekst: 'Twee verse pasta’s per dag (vlees en vega), ca. € 4,50. Rij vanaf ca. 12:00.', link: 'https://www.timeout.com/rome/restaurants/pastifcio-guerra' },
      { naam: 'Pizzarium (Bonci) · €–€€', adres: 'Via della Meloria 43 (bij het Vaticaan)', tekst: 'Beroemdste pizza al taglio van Rome, per gewicht; gemiddeld ca. € 15. Maandag dicht.', link: 'https://bonci.it' },
      { naam: 'Trapizzino · €', adres: 'Piazza Trilussa 46 (Trastevere) en andere vestigingen', tekst: 'Pizzazakje met Romeinse stoofvulling, € 4–5; supplì € 1,50–2,50.' },
      { naam: 'Mercato di Testaccio · €', adres: 'Testaccio', tekst: 'Overdekte markt met eetkraampjes (bv. Mordi e Vai). Ma–za 7:00–15:30.', link: 'https://www.romeing.it/mercato-testaccio-food-market-rome/' },
      { naam: 'Mercato Centrale · €–€€', adres: 'Station Termini, Via Giolitti 36', tekst: 'Foodhall met Romeinse klassiekers.' },
      { naam: 'Pizzeria Da Remo · €', adres: 'Piazza di Santa Maria Liberatrice 44, Testaccio', tekst: 'Dunne Romeinse pizza, € 7–15. ’s Avonds rij.' },
      { naam: 'Pizzeria Ai Marmi · €', adres: 'Viale di Trastevere 53', tekst: 'Bijnaam “L’Obitorio” (het mortuarium) door de marmeren tafels. Open tot laat. Goed bereikbaar met tram 8.', link: 'https://www.wantedinrome.com/yellowpage/pizzeria-ai-marmi.html' },
      { naam: 'Antico Forno La Renella · €', adres: 'Via del Moro 15, Trastevere', tekst: 'Bakkerij met pizza al taglio; aan de toonbank zie je de pizza maken. Goed bereikbaar met tram 8.', link: 'https://anamericaninrome.com/2017/07/la-renella-pizza-go-trastevere-rome/' }
    ] },

  { titel: 'Middenklasse (€€) en voor docenten (€€€)',
    items: [
      { naam: 'Da Enzo al 29 · €€', adres: 'Via dei Vascellari 29, Trastevere', tekst: 'Klassiek Romeins. Geen reserveringen voor diner: om 18:30 in de rij.' },
      { naam: 'Trattoria Da Teo · €€', adres: 'Piazza dei Ponziani 7A, Trastevere', tekst: 'Rustiger alternatief voor Da Enzo.' },
      { naam: 'Hosteria Grappolo d’Oro · €€', adres: 'Piazza della Cancelleria 80 (achter Piazza Navona)', tekst: 'Michelin-tip voor klassiek Romeins.' },
      { naam: 'Armando al Pantheon · €€', adres: 'Salita de’ Crescenzi 31', tekst: 'Romeinse klassiekers plus enkele recepten van antieke inspiratie. Zondag dicht, ver vooruit reserveren.' },
      { naam: 'Roscioli Salumeria con Cucina · €€€', adres: 'Via dei Giubbonari 21', tekst: 'Beste trattoria van Italië volgens 50 Top Italy 2026. Diner 3 weken vooruit boeken; lunch makkelijker.' }
    ] },

  { titel: 'Eten in de buurt van Monteverde en Gianicolense',
    intro: 'Goed bereikbaar met tram 8 (halte Stazione Trastevere en verder). Ook handig: de restaurants in Trastevere hierboven.',
    items: [
      { naam: 'La Gatta Mangiona · €€', adres: 'Via Federico Ozanam 30-32, Monteverde', tekst: 'Een van de beste pizza’s van Rome; elke maand een speciale “pizza van de maand”.', link: 'https://www.romeing.it/rome-monteverde-neighbourhood/' },
      { naam: 'Da Cesare al Casaletto · €€–€€€', adres: 'Via del Casaletto 45', tekst: 'Topper onder de trattoria’s, tien passen van de eindhalte van tram 8.', link: 'https://www.scattidigusto.it/roma-dove-mangiare-monteverde' }
    ] },

  { titel: 'Eten in de buurt van Ostiense en Garbatella',
    intro: 'Goed bereikbaar met metro B (halte Garbatella). Ook dichtbij, in Testaccio: Flavio al Velavevodetto, Mercato di Testaccio en Pizzeria Da Remo.',
    items: [
      { naam: 'Eataly Roma · €–€€€', adres: 'Piazzale XII Ottobre 1492', tekst: 'Grote foodhall met veel eetplekken, open 10:00–24:00. Handig voor verschillende budgetten; zitrestaurant Pizza & Cucina is duurder. Heeft ook een grote levensmiddelenafdeling.', link: 'https://www.timeout.com/rome/shopping/eataly' },
      { naam: 'Porto Fluviale · €€', adres: 'Via del Porto Fluviale 22', tekst: 'In een oud pakhuis: pizzeria, trattoria en een grote zaal voor groepen.', link: 'https://www.romeing.it/it/i-migliori-ristoranti-a-ostiense/' },
      { naam: 'Trattoria Pennestri · €€ (vooral voor docenten)', adres: 'Via Giovanni da Empoli 5', tekst: 'Michelin-tip: Romeinse klassiekers met een moderne draai.', link: 'https://guide.michelin.com/it/it/best-of/roma-e-le-sue-migliori-trattorie' },
      { naam: 'Romeow Cat Bistrot · €€', adres: 'Via Francesco Negri 15', tekst: 'Veganistisch, met zes vrij rondlopende katten. Reserveren sterk aangeraden.', link: 'https://www.romeing.it/romeow-rome-cat-bistrot/' },
      { naam: 'Dar Moschino · €–€€', adres: 'Circonvallazione Ostiense 225, Garbatella', tekst: 'Ouderwetse buurttrattoria.', link: 'https://zero.eu/it/guide/mangiare-e-bere-a-garbatella/' }
    ] },

  { titel: 'Supermarkten rond Monteverde en Gianicolense',
    intro: 'Todis is een budgetketen (het goedkoopst). Carrefour Market en Iper Pewex zijn groot en lang open. Koop hier brood, beleg, fruit en water voor de lunch. Adressen en openingstijden: check Google Maps (stand oktober 2026).',
    items: [
      { naam: 'Iper Pewex · €', adres: 'Via Antonio Pacinotti 10 (bij Station Trastevere)', tekst: 'Grote supermarkt met bakkerij, ook veel vegan/glutenvrij. Elke dag 8:00–21:00.', link: 'https://www.google.com/maps/place/?q=place_id:ChIJ9XFbS5yKJRMRh5guV6L6o60' },
      { naam: 'DEM Supermercati · €', adres: 'Via Cesare Pascarella 20', tekst: 'Ruime buurtsupermarkt. Ma–za 7:30–20:30.', link: 'https://www.google.com/maps/place/?q=place_id:ChIJ5erI9CNgLxMR7cTlq7Y-or4' },
      { naam: 'Elite Supermercato · €', adres: 'Viale di Trastevere 219', tekst: 'Goed gesorteerd, ook verse sushi en bio. Ma–za 8:00–20:30.', link: 'https://www.google.com/maps/place/?q=place_id:ChIJdRZ9diNgLxMRPCXun9Sjcgo' },
      { naam: 'Todis · €', adres: 'Piazza Ippolito Nievo 35-36', tekst: 'Budgetsupermarkt, ook kant-en-klare pizza. Ma–za 8:00–21:00, zondag dicht.', link: 'https://www.google.com/maps/place/?q=place_id:ChIJO2in3W1hLxMRRdy-bnQxazo' },
      { naam: 'Conad · €', adres: 'Via Anton Giulio Barrili 20 (Monteverde)', tekst: 'Grote Conad met bakkerij. Ma–za 7:30–20:30.', link: 'https://www.google.com/maps/place/?q=place_id:ChIJf_SypRhgLxMR7Ow-I1XaEg0' }
    ] },

  { titel: 'Supermarkten rond Ostiense en Garbatella',
    items: [
      { naam: 'Todis · €', adres: 'Piazza Attilio Pecile 50 (Garbatella)', tekst: 'Dichtstbijzijnde budgetsupermarkt. Ma–za 8:00–20:30.', link: 'https://www.google.com/maps/place/?q=place_id:ChIJUUP4iX-KJRMRT2Kbnr5jEYM' },
      { naam: 'Carrefour Market · €', adres: 'Via Ignazio Persico 82', tekst: 'Grote supermarkt, Engels wordt gesproken. Elke dag 7:00–22:00.', link: 'https://www.google.com/maps/place/?q=place_id:ChIJEfnvUn6KJRMRYvuFex7te2E' },
      { naam: 'Todis · €', adres: 'Via Caffaro 115', tekst: 'Klein maar goedkoop, goede groente en fruit. Ma–za 8:00–21:00.', link: 'https://www.google.com/maps/place/?q=place_id:ChIJb5YtNBOLJRMRhFFexV5eJOI' },
      { naam: 'Gros Supermercati · €', adres: 'Via Caffaro 55', tekst: 'Grote supermarkt, zowel merken als goedkope huismerken. Ma–za 8:00–21:00.', link: 'https://www.google.com/maps/place/?q=place_id:ChIJJy03AlCLJRMRkxRSbKf3I04' },
      { naam: 'Carrefour Market · €', adres: 'Via Giacomo Bove 4 (bij station Roma Ostiense)', tekst: 'Ruim aanbod. Elke dag 7:00–22:00.', link: 'https://www.google.com/maps/place/?q=place_id:ChIJc1t1BStgLxMR8NeTbazoQqc' },
      { naam: 'Todis · €', adres: 'Via Ostiense 75 (bij station Roma Ostiense)', tekst: 'Volgens recensies de laagste prijzen in de buurt; aan de deli maken ze ook panini. Ma–za 8:00–21:00.', link: 'https://www.google.com/maps/place/?q=place_id:ChIJR9gNritgLxMR0BbnZIurE9s' },
      { naam: 'Eataly Roma', adres: 'Piazzale XII Ottobre 1492', tekst: 'Heeft ook een grote levensmiddelenafdeling (zie hierboven).' }
    ] },

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
      { naam: 'Staan is het goedkoopst', tekst: 'Staand aan de bar betaal je het minst, zitten binnen kost meer en op het terras betaal je het meest.' },
      { naam: 'Gratis drinkwater', tekst: 'In Rome staan overal kleine drinkfonteinen (nasoni) met gratis, koel drinkwater. Neem een navulbare fles mee.' }
    ] },
  { titel: 'Slim reizen',
    items: [
      { naam: 'Zakkenrollers', tekst: 'Vooral in drukke bussen, bij de Trevifontein, in metro en op toeristische plekken. Houd je tas voor je en je telefoon op zak.' },
      { naam: 'Kleding in kerken', tekst: 'Schouders en knieën bedekt in de kerken. Doe een lichte trui of sjaal in je tas.' },
      { naam: 'Siesta', tekst: 'Winkels zijn vaak gesloten van 13.00 tot 16.00/16.30 uur. Plan je rustpauze dan.' },
      { naam: 'Stilzitverbod', tekst: 'Op de Spaanse Trappen en de trappen van het monument van Victor Emanuel II mag je niet zitten, eten of drinken. Boetes zijn voor eigen rekening.' }
    ] }
];
