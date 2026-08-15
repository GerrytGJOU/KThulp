# Vocabulaire-uitbreiding Chronica Classica — hoogfrequente signaalwoorden

Referentiebestand, geen masterplan. Vastgelegd 2026-08-07 (zie Chronica.md §7.56).

## Aanleiding

Combat trekt vragen uitsluitend uit `SP_STATE.vocab` — de woorden die de speler
tot dan toe daadwerkelijk is tegengekomen via `VOCAB:`-secties
(`spCombatNextQuestion`, `certamen/singleplayer.js`), niet uit de volledige
woordenlijst. De bestaande "verhaal-woorden" per hoofdstuk zijn vrijwel
allemaal zelfstandige naamwoorden en enkele werkwoorden die letterlijk in de
scènetekst vielen — nauwelijks voorzetsels, voegwoorden of hoogfrequente
werkwoorden. Bij een klein cumulatief woordenpool (vooral Hoofdstuk 1-4) voelt
Combat daardoor snel repetitief.

## Methode

1. **Bron**: `certamen/vocab.js` (`VOCAB_LA`/`VOCAB_EL`) — al frequentie-
   gerangschikt (f:1-1000+), zelf al gegenereerd uit dezelfde Pallas/Minerva-
   Excel-woordenlijsten.
2. **Curriculum-plafond per hoofdstuk**: het hoogste Pallas-les- en Minerva-
   hoofdstuknummer dat Chronica's eigen `SP_CAMPAIGN`-data tot en met dat
   hoofdstuk citeert (cumulatief, oplopend, nooit dalend).
3. **Woordsoort-filter**: alleen `verb.`/`prep.`/`cj.`/`adv.`/`pron.`/
   vraagpartikels — geen zelfstandige/bijvoeglijke naamwoorden (dat blijven
   verhaal-woorden).
4. **Uitsluiting**: elk woord dat al ergens in `SP_VOCAB_ENTRIES` staat, en elk
   woord dat al aan een eerder hoofdstuk is toegekend (geen dubbelingen).
5. **Sortering**: op frequentie — het hoogst-prioritaire woord staat bovenaan
   per hoofdstuk.

Kanttekening: de Minerva-plafonds zijn een interpretatie (grammatica wordt
soms bewust "vooruitgehaald" los van Minerva's eigen boekvolgorde) — zie
Chronica.md §7.56 voor de volledige toelichting.

## Status

**Hoofdstuk 1-14: GEBOUWD** (2026-08-07, Chronica.md §7.56) — 270 woorden
(130 GR + 140 LA) toegevoegd aan `SP_VOCAB_ENTRIES` en aan elke hoofdstuk-
`VOCAB:`-sectie (inclusief twee gloednieuwe `VOCAB:`-secties voor Hoofdstuk 10
en 12, die er voorheen geen hadden). Totale pool: 421 woorden (was 154).

**Hoofdstuk 15: GEBOUWD** (2026-08-08, Chronica.md §7.6x) — alle 20
signaalwoorden hieronder zijn toegevoegd aan `SP_VOCAB_ENTRIES` en aan
Hoofdstuk 15's `VOCAB:`-sectie (hub-scène `CH15_000`), samen met 11 nieuwe
verhaal-woorden (`grieks_oikos`/`doule`/`doulos`/`histos`,
`latijn_domus`/`familia`/`servus`/`serva`/`uxor`/`manumissio`).

**Hoofdstuk 16: GEBOUWD** (2026-08-08/09, Chronica.md §7.61) — de 20
signaalwoorden in de H16-sectie hieronder zijn inmiddels toegevoegd aan
`SP_VOCAB_ENTRIES` en Hoofdstuk 16's `VOCAB:`-sectie, net als bij H15.

**Hoofdstuk 17 t/m Finale: NOG NIET GEBOUWD (oorspronkelijke tekst,
2026-08-07)** — onderstaande lijst was een kandidatenreserve, klaar om in te
zetten zodra deze hoofdstukken daadwerkelijk worden gebouwd. Plafonds
gebruiken de `pallas`/`minerva`-velden die al in `SP_CAMPAIGN` stonden ten
TIJDE van het schrijven (2026-08-07): Pallas was toen verondersteld op te
raken bij het toenmalige Hoofdstuk 18, Minerva bij het toenmalige
Hoofdstuk 20.

> **BACKLOG-BEVINDING (2026-08-15, op Gerbens verzoek herbekeken)**: een
> frequentie-gap-analyse tegen `certamen/vocab.js` (alle GR/LA verb./prep./
> cj./adv./pron.-woorden die nog NERGENS in `SP_VOCAB_ENTRIES` voorkomen,
> gesorteerd op frequentie) laat zien dat de onderstaande kandidatenlijsten
> voor het overgrote deel **nooit daadwerkelijk zijn ingebouwd** — niet
> alleen Hoofdstuk 24/25 (die inderdaad slechts 2 resp. 4 verhaal-woorden
> kregen, geen signaalwoorden), maar ook Hoofdstuk 17 t/m 23, die inmiddels
> allemaal wél gebouwd én gekoppeld zijn zonder deze uitbreiding. Alleen
> Hoofdstuk 15-16 hebben hun geplande 10+10 daadwerkelijk gekregen.
> **Hoofdstuk 24 en 25 zijn op 2026-08-15 alsnog met 10+10 signaalwoorden
> aangevuld** (zie §"Hoofdstuk 24/25 — RETROFIT" hieronder) — dat was
> goedkoop en risicoloos omdat beide nog niet gekoppeld waren.
> **Hoofdstuk 17 t/m 23 zijn, als aparte klus, eveneens op 2026-08-15
> geretrofit** (zie §"Hoofdstuk 17-23 — RETROFIT" hieronder) — zeven
> al gekoppelde, live hoofdstukken kregen elk hun 10+10, puur additief
> (nieuwe/aangevulde `VOCAB:`-secties, geen wijziging aan scène-structuur,
> keuzes of grammatica). Daarmee zijn Hoofdstuk 1-25 nu allemaal volledig
> op methode; alleen Hoofdstuk 26/27 (kandidatenreserve hieronder) en
> Hoofdstuk 28 t/m Finale staan nog open.

**BELANGRIJK — hoofdstuknummers hieronder zijn ACHTERHAALD sinds de
KCV-audit van 2026-08-09 (Chronica.md §7.65-7.66):** er zijn 7 nieuwe
hoofdstukken ingevoegd (18-21, 24-27) en de oude Hoofdstuk 19-22+Finale
zijn hernummerd naar 22-23 en 28-30 (zie `PALLAS_MINERVA_OVERZICHT.md`).
De woordenlijsten hieronder zijn zelf nog prima bruikbaar (het zijn gewoon
hoogfrequente signaalwoorden, cumulatief oplopend), maar de sectiekoppen
"H18"/"H19"/"H20"/"H21"/"H22"/"Finale" hieronder verwijzen naar de OUDE
nummering. Vertaaltabel: oud-H18 → nieuw-H20 (hier ligt ook echt Pallas-les
29, "laatste Pallas-les" — NIET het nieuwe Hoofdstuk 18, dat is nu "Wie
Betaalt, Bepaalt" zonder nieuwe grammatica), oud-H19 → nieuw-H22, oud-H20 →
nieuw-H23 (hier ligt ook echt Minerva-hoofdstuk 25, "laatste
Minerva-hoofdstuk"), oud-H21 → nieuw-H28, oud-H22 → nieuw-H29, oud-Finale
→ Finale (nr 30, ongewijzigd). Voor de nieuwe, tussengevoegde hoofdstukken
18, 19, 21, 24, 25, 26, 27 bestaat nog GEEN signaalwoorden-kandidatenlijst
— die moet apart samengesteld worden zodra zo'n hoofdstuk aan de beurt is,
met dezelfde methode als hierboven (§Methode).

### H15 (Pallas ≤25, Minerva ≤21) — GEBOUWD
GR: ἀνά *omhoog* · φημί *zeggen, beweren* · παρά *van; naast; tegen* · δίδωμι *geven* · ὅταν *wanneer ook maar* · δείκνυμι *tonen, aanwijzen* · τίθημι *plaatsen, stellen* · εἶμι *ik zal gaan* · ἑκάτερος *ieder (van twee)* · προστίθημι *toevoegen*
LA: nego *ontkennen* · ob *voor* · loquor *spreken* · iaceo *liggen* · pereo *te gronde gaan* · muto *veranderen* · transeo *oversteken* · servo *redden, bewaren* · tollo *tillen, heffen* · antea *vroeger, eerst*

### H16 (Pallas ≤27, Minerva ≤21)
GR: ἵημι *werpen, loslaten* · ἵστημι *plaatsen, doen staan* · καθίστημι *opstellen; brengen tot* · ἀπόλλυμι *vernietigen; omkomen* · ἀποδίδωμι *teruggeven* · ἀφαιρέω *wegnemen* · διδάσκω *onderwijzen* · ἀφίημι *wegzenden, loslaten* · τελευτάω *eindigen; sterven* · ἐάω *toelaten, laten*
LA: adhuc *nog* · cogito *(be)denken* · postquam *nadat* · iudico *oordelen, menen* · velut *zoals; als het ware* · longe *ver, verreweg* · quicumque *wie ook maar* · respondeo *(be)antwoorden* · colo *bebouwen, vereren* · nolo *niet willen*

### H17 (Pallas ≤28, Minerva ≤21)
GR: πρός *naar, bij* · οἶδα *weten* · γράφω *schrijven* · αἰσθάνομαι *waarnemen* · καταλαμβάνω *grijpen, betrappen* · μάχομαι *vechten* · τιμάω *eren* · ἴσως *misschien* · πίπτω *vallen* · κατασκευάζω *inrichten, klaarmaken*
LA: solvo *losmaken, betalen* · vix *nauwelijks* · laudo *prijzen* · amitto *wegsturen, verliezen* · efficio *tot stand brengen* · maneo *blijven, wachten* · -ve *of* · compono *samenstellen* · amo *houden van* · impono *plaatsen op*

### H18 (Pallas ≤29 — laatste Pallas-les, Minerva ≤23)
GR: εἶτα *dan, vervolgens* · κωλύω *verhinderen* · διαφθείρω *vernietigen, bederven* · πως *op een of andere wijze* · ἔνθα *daar* · πυνθάνομαι *vernemen* · τέμνω *snijden* · λανθάνω *verborgen zijn* · πάντως *geheel, in elk geval* · τρέπω *wenden, keren*
LA: quod (vw.) *dat; omdat* · adversus *tegen(over)* · verto *(om)draaien* · occupo *innemen, bezetten* · absum *afwezig zijn* · quoniam *omdat* · incipio *beginnen* · propter *wegens, dichtbij* · opto *wensen* · procul *ver, in de verte*

### H19 (Pallas ≤29 — geen nieuwe les meer, Minerva ≤23)
GR: ὅμως *toch, niettemin* · λείπω *verlaten, achterlaten* · τίκτω *baren, voortbrengen* · κομίζω *verzorgen; brengen* · βλέπω *kijken, zien* · φρονέω *denken, verstandig zijn* · παρασκευάζω *klaarmaken* · δράω *doen, handelen* · σκοπέω *beschouwen* · ἐρωτάω *vragen*
LA: nondum *nog niet* · impero *bevelen* · specto *kijken, bekijken* · scribo *schrijven* · disco *leren* · interficio *doden* · constituo *(op)stellen, besluiten* · accedo *naderen* · adeo *zo(zeer)* · cupio *wensen, verlangen*

### H20 (Pallas ≤29, Minerva ≤25 — laatste Minerva-hoofdstuk)
GR: πολεμέω *oorlog voeren* · θύω *offeren* · ἐλαύνω *drijven* · δέδοικα *vrezen* · ὧδε *zo, aldus* · βοηθέω *helpen* · μάλα *zeer, erg* · αἰτέω *vragen om* · ἆρα *(vraagpartikel)* · διώκω *achtervolgen*
LA: patior *verdragen, toelaten* · cogo *bijeenbrengen* · prosum *tot voordeel zijn* · cedo *gaan; wijken* · contra *tegen(over)* · adicio *toevoegen* · tamquam *als het ware* · tempto *aanraken, onderzoeken* · usque *continu, steeds* · exerceo *(uit)oefenen*

### H21 (volledige pool — Pallas en Minerva beide uitgeput)
GR: τολμάω *durven, wagen* · αὐτίκα *meteen* · βαίνω *gaan, stappen* · ἀμφί *aan weerszijden van* · φράζω *vertellen, uitleggen* · ἀγγέλλω *berichten* · ἀγνοέω *niet weten* · ᾄδω *zingen* · ἀναγιγνώσκω *herkennen; lezen* · ἀναγκάζω *noodzaken; dwingen*
LA: ibi *daar* · noceo *benadelen, schaden* · perdo *verwoesten, verliezen* · appello *roepen, noemen* · ideo *daarom* · tandem *eindelijk* · dubito *twijfelen* · iuvo *helpen* · umquam *ooit* · quamvis *hoe … ook*

### H22 (volledige pool)
GR: ἀνέχομαι *verdragen* · ἀνοίγω *openen* · ἀπατάω *bedriegen* · ἀποκρίνομαι *antwoorden* · ἀπορέω *in onzekerheid zijn* · ἀποφαίνω *aantonen* · ἅπτομαι *aanraken* · ἀρέσκω *bevallen* · ἁρπάζω *roven; grijpen* · βλάπτω *schade toebrengen*
LA: orior *opgaan, ontstaan* · prohibeo *afhouden, verhinderen* · super *boven(dien)* · frango *breken* · erro *dwalen, zich vergissen* · lego *verzamelen, lezen, kiezen* · metuo *bang zijn, vrezen* · qualis *hoe(danig)* · queror *klagen* · huc *hierheen*

### Finale (volledige pool)
GR: γαμέω *trouwen* · γυμνάζω *trainen* · δακρύω *huilen* · διαβαίνω *oversteken* · διαλέγομαι *een gesprek voeren* · διατελέω *blijven doen* · δικάζω *rechtspreken* · δύομαι *duiken; aantrekken* · ἐλπίζω *hopen* · ἐντυγχάνω *ontmoeten*
LA: exeo *weggaan, verlaten* · intra *binnen* · nescio *niet weten* · desino *ophouden* · gaudeo *blij zijn* · cur *waarom* · permitto *laten gaan, toestaan* · aliquando *eens, soms* · defendo *verdedigen* · miror *bewonderen, verwonderen*

### Hoofdstuk 24/25 — RETROFIT (2026-08-15, GEBOUWD)

Volledige pool (Pallas/Minerva al sinds Hoofdstuk 23 uitgeput) — de eerste
40 nog ongebruikte woorden op de frequentielijst, verdeeld 10+10 per
hoofdstuk, toegevoegd aan `SP_VOCAB_ENTRIES` en aan de hub-scènes
`CH24_000`/`CH25_000`.

**H24**: GR: μέν…δέ *enerzijds…anderzijds* · τε *en* · ἄν
*(potentieel-/algemeenheidspartikel)* · δέω *nodig hebben, missen* · οὔτε
*noch…noch* · φύω *voortbrengen; groeien* · ἄρα *dus, dan* · χράομαι
*gebruiken* · ὑπάρχω *bestaan, beginnen* · ποτε *ooit, eens*
LA: ac *en, en ook* · quod (vw.) *dat; omdat* · ergo *dus* · sequor
*volgen* · inquam *zeggen* · modo *zojuist* · parum *(te) weinig* · saepe
*vaak* · sub *onder* · patior *verdragen, toelaten*

**H25**: GR: ὑπέρ *voor; boven* · πράσσω *doen, handelen* · μήτε…μήτε
*noch…noch* · ἀλλήλων *elkaar* · συμβαίνω *gebeuren; overeenkomen* · μήν
*(versterkend partikel)* · μηδέ *en niet* · κινέω *bewegen* · πῶς *hoe?* ·
ὅσπερ *juist degene die*
LA: haud *niet, helemaal niet* · cogo *bijeenbrengen* · sentio *voelen,
merken* · prosum *tot voordeel zijn* · verto *(om)draaien* · premo
*(onder)drukken* · intellego *begrijpen* · adsum *aanwezig zijn* · praesto
*overtreffen; geven* · redeo *teruggaan*

**Validatie**: `node --check` slaagt, alle 40 nieuwe id's resolven in
`SP_VOCAB_ENTRIES`, live BFS-doorloop (beide hoofdstukken, taalspoor
"beide") geeft 0 exceptions en 46 verzamelde vocab-woorden.

### Hoofdstuk 17-23 — RETROFIT (2026-08-15, GEBOUWD)

De oude H17-22/Finale-kandidatenlijsten hierboven (§100-134) waren geschreven
tegen een inmiddels achterhaalde hoofdstuknummering en overlapten deels met
de woorden die de Hoofdstuk 24/25-retrofit inmiddels had verbruikt. In plaats
daarvan is voor deze klus een verse frequentie-gap-analyse tegen
`certamen/vocab.js` gedraaid (cumulatief niet-overlappend met alles wat al in
`SP_VOCAB_ENTRIES` stond, inclusief de H24/25-retrofit) en 10+10 per
hoofdstuk toegekend aan `SP_VOCAB_ENTRIES` en aan elke hub-scène
(`CH17_000` t/m `CH23_000`; `CH21_000` en `CH22_000` hadden nog helemaal
geen `VOCAB:`-sectie en kregen er voor het eerst een).

**H17**: GR: χωρίς *apart; zonder* · ἄλλως *anders* · ὁμολογέω *instemmen,
toegeven* · αὖ *weer; anderzijds* · καίτοι *en toch* · μεταξύ *tussen* ·
προσήκω *toebehoren; passen* · μίγνυμι *mengen* · παραδίδωμι *overdragen,
overleveren* · ἐκεῖ *daar*
LA: rursus *weer, opnieuw* · sumo *nemen* · incipio *beginnen* · propter
*wegens, dichtbij* · opto *wensen* · facile *gemakkelijk* · procul *ver, in
de verte* · tempto *aanraken, onderzoeken, aanvallen* · nondum *nog niet* ·
quippe *immers, want*

**H18**: GR: μιμνήσκω *herinneren* · θνῄσκω *sterven* · ἁπλῶς *eenvoudig* ·
κωλύω *verhinderen* · ἁμαρτάνω *missen; fout maken* · διαφθείρω
*vernietigen, bederven* · πως *op een of andere wijze* · ἔνθα *daar* ·
πειράω *proberen* · φοβέω *bang maken; vrezen*
LA: exigo *verdrijven, eisen, afmaken* · impero *bevelen* · specto *kijken,
bekijken* · scribo *schrijven* · qua *waar, waarheen, op welke manier* ·
addo *toevoegen* · disco *leren, leren kennen* · interficio *doden* ·
contingo *aanraken* · constituo *(op)stellen, besluiten*

**H19**: GR: ὅπου *waar* · συμφέρω *nuttig zijn* · πυνθάνομαι *vernemen,
informeren* · τέμνω *snijden* · ὑπολαμβάνω *opnemen; aannemen* · λανθάνω
*verborgen zijn* · πάντως *geheel, in elk geval* · πορεύω *vervoeren; gaan* ·
ἀποκρίνω *scheiden; antwoorden* · κατηγορέω *beschuldigen*
LA: usque *continu, steeds* · accedo *naderen, gaan naar* · adeo *zo(zeer)* ·
interim *ondertussen; voorlopig* · potius *liever, eerder* · cupio *wensen,
willen, verlangen* · exerceo *(uit)oefenen, in beweging houden* · ibi *daar* ·
noceo *benadelen, schaden* · perdo *verwoesten, verliezen*

**H20**: GR: τρέπω *wenden, keren* · ὅμως *toch, niettemin* · κτάομαι
*verwerven* · λείπω *verlaten, achterlaten* · τίκτω *baren, voortbrengen* ·
κομίζω *verzorgen; brengen* · βλέπω *kijken, zien* · φρονέω *denken,
verstandig zijn* · ὁρμάω *in beweging brengen; haasten* · παρασκευάζω
*klaarmaken*
LA: appello *roepen, noemen* · ideo *daarom* · tandem *eindelijk* · dubito
*twijfelen, aarzelen* · claudo *sluiten* · iuvo *helpen* · umquam *ooit* ·
malo *liever willen* · quamvis *hoe … ook* · orior *opgaan, ontstaan,
beginnen*

**H21**: GR: λαλέω *praten, kletsen* · δράω *doen, handelen* · σκοπέω
*beschouwen, onderzoeken* · ἐρωτάω *vragen, ondervragen* · πολεμέω *oorlog
voeren* · θύω *offeren* · ἐλαύνω *drijven* · δέδοικα *vrezen (perf. = pres.)*
· ὧδε *zo, aldus* · ἁλίσκομαι *gevangen worden*
LA: prohibeo *afhouden (van), verhinderen* · quamquam *hoewel* · super
*boven(dien)* · tego *bedekken, beschermen* · etiamsi *zelfs als, ook als* ·
frango *breken* · erro *dwalen, zwerven, zich vergissen* · lego *verzamelen,
lezen, kiezen* · metuo *bang zijn, vrezen* · queror *klagen*

**H22**: GR: βοηθέω *helpen* · ἀπαλλάσσω *bevrijden, wegsturen* · βουλεύω
*beraadslagen, besluiten* · μάλα *zeer, erg* · αἰτέω *vragen om* · ἆρα
*(vraagpartikel — apart van het al bestaande ἄρα "dus, dan")* · διώκω
*achtervolgen* · οὐκοῦν *dus zeker* · τολμάω *durven, wagen* · αὐτίκα
*meteen*
LA: divido *(ver)delen* · huc *hierheen* · exeo *weggaan, verlaten* ·
contemno *verachten, minachten* · intra *binnen* · nescio *niet weten* ·
retineo *vasthouden* · desino *ophouden* · gaudeo *blij zijn, zich
verheugen* · augeo *vergroten*

**H23**: GR: βαίνω *gaan, stappen* · περ *(versterkend enclitisch
partikel)* · ἀμφί *aan weerszijden van, om* · φράζω *vertellen, uitleggen* ·
ποῦ *waar?* · ναί *ja* · πότε *wanneer?* · ἀγγέλλω *berichten* · ἀγνοέω
*niet weten* · ᾄδω *zingen*
LA: intersum *liggen tussen, verschillen* · aspicio *zien* · cur *waarom* ·
male *slecht* · permitto *laten gaan, toestaan* · confero *bijeen brengen,
vergelijken* · misceo *mengen, verwarren* · aliquando *eens, soms* ·
defendo *verdedigen* · miror *bewonderen, verwonderen*

**Validatie**: `node --check` slaagt, alle 140 nieuwe id's resolven in
`SP_VOCAB_ENTRIES` en zijn zonder dubbelingen aan de zeven hub-scènes'
`VOCAB:`-secties gekoppeld; `validate_chronica.js` geeft dezelfde 3
vooraf-bestaande fouten (Hoofdstuk 25-payoffs die wachten op een nog niet
gekoppeld Hoofdstuk 24-flag, losstaand van deze klus) en geen nieuwe.
Cache-busting in `certamen/index.html` opgehoogd naar `?v=20260815a`.

### Hoofdstuk 26 — GEBOUWD (2026-08-15)

GR: εἶτα *dan, vervolgens* · ζάω *leven* · μέντοι
*echter; natuurlijk* · μέχρι *tot, totdat* · φυλάσσω *bewaken* · δηλόω
*tonen, duidelijk maken* · ἦ *voorwaar* · τοίνυν *welnu, dus* · ἔρομαι
*vragen* · εἴτε…εἴτε *hetzij…hetzij*
LA: excipio *uitnemen, oppakken* · cedo *gaan; wijken* · contra
*tegen(over)* · ceterum *overigens* · exspecto *afwachten* · eripio
*wegrukken* · rapio *grijpen, roven* · aio *zeggen* · existimo *menen,
oordelen* · desum *afwezig zijn, in de steek laten*

Toegevoegd aan `SP_VOCAB_ENTRIES` en de `VOCAB:`-sectie van `CH26_000`.
Gevalideerd: `node --check` slaagt, alle 20 id's resolven, losse
parse-check geeft 29/29 bereikbare scènes en 0 fouten.

### Hoofdstuk 27 — kandidatenreserve (2026-08-15, NOG NIET GEBOUWD)

Volgende 10+10 op dezelfde frequentielijst, gereserveerd zodra dit
hoofdstuk daadwerkelijk geschreven wordt — nog NIET in
`SP_VOCAB_ENTRIES`.

**H27** (kandidaat): GR: ἀξιόω *waardig achten* · ἕως *totdat; zolang* ·
ἔοικα *lijken op* · κἄν *zelfs als* · ἕνεκα *wegens, omwille van* · μένω
*blijven* · ἀναιρέω *opnemen; doden* · ἄνω *omhoog, boven* · τάσσω
*opstellen, ordenen* · ὅθεν *vanwaar*
LA: occupo *innemen, bezetten* · sive *of* · doceo *leren, onderrichten* ·
nosco *leren kennen* · mox *spoedig* · adicio *toevoegen* · tamquam *als
het ware* · affero *brengen naar* · absum *afwezig zijn, weg zijn* ·
quoniam *omdat*

## Bij het bouwen van een van deze hoofdstukken

1. Neem de 10+10 woorden hierboven, controleer of de Pallas/Minerva-koppeling
   in `SP_CAMPAIGN` inmiddels is aangepast (curriculum kan verschuiven —
   zie de renummeringsgeschiedenis in Chronica.md §7.44/§7.45).
2. Genereer id's volgens de bestaande conventie (`grieks_<transliteratie>`,
   `latijn_<lemma>`) en voeg toe aan `SP_VOCAB_ENTRIES`.
3. Voeg toe aan het hoofdstuk se `VOCAB:`-sectie (hub-scène).
4. `node --check` + `validate_chronica.js` opnieuw draaien.
