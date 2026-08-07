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

**Hoofdstuk 15 t/m Finale: NOG NIET GEBOUWD** — onderstaande lijst is een
kandidatenreserve, klaar om in te zetten zodra deze hoofdstukken daadwerkelijk
worden gebouwd. Plafonds gebruiken de `pallas`/`minerva`-velden die al in
`SP_CAMPAIGN` staan; Pallas is vanaf H18 uitgeput (les 29, laatste), Minerva
vanaf H20 (hoofdstuk 25, laatste) — daarna blijft het plafond simpelweg de
volledige woordenlijst.

### H15 (Pallas ≤25, Minerva ≤21)
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

## Bij het bouwen van een van deze hoofdstukken

1. Neem de 10+10 woorden hierboven, controleer of de Pallas/Minerva-koppeling
   in `SP_CAMPAIGN` inmiddels is aangepast (curriculum kan verschuiven —
   zie de renummeringsgeschiedenis in Chronica.md §7.44/§7.45).
2. Genereer id's volgens de bestaande conventie (`grieks_<transliteratie>`,
   `latijn_<lemma>`) en voeg toe aan `SP_VOCAB_ENTRIES`.
3. Voeg toe aan het hoofdstuk se `VOCAB:`-sectie (hub-scène).
4. `node --check` + `validate_chronica.js` opnieuw draaien.
