# Fase 6 — Toetsing aan Levend Latijn en onderdompeling

## 1. Functionaliteit: heeft elk fragment een reden binnen de fictie?

Beoordeling van alle 39 fragmenten (Fase 1):

- **13 leesvallen**: functioneel zonder uitzondering. Elke leesval is een
  inscriptie, uitroep of citaat dat een bestaand personage of voorwerp binnen
  de fictie logisch zou zeggen/dragen (een wachter, een uitkijk, een
  gekraste steen, Thetis' orakelspreuk) — nooit een geïsoleerde
  oefenzin-in-vermomming.
- **26 gloss-fragmenten**: eveneens functioneel qua *plaatsing* (de
  Boodschapper zegt "Ecce" omdat ze dat nu eenmaal altijd zegt; Laocoön
  citeert zichzelf op een dramatisch moment) — maar met één randgeval:
  `CH6_008` (Sfinxraadsel, "Mane quadrupes...") is een raadsel dat *toevallig
  ook* de bestaande `puzzle_ch6_sfinx` echoot; dat is geen "oefening in
  vermomming" (het raadsel bestaat al binnen de mythe zelf) maar wel het
  enige fragment waar taalverwerving en verhaalfunctie zo expliciet
  samenvallen dat je merkt dat het door een ontwerper zo gepland is — in
  positieve zin, dit is precies het `Chronica_Verhaalteksten`-idee waar de
  rest van het spel naartoe zou moeten.

**Geen fragmenten voelen als pure oefening.** Dit is een van de sterkste
punten van het huidige ontwerp — er is nergens een NPC die "toevallig" een
grammaticazin opzegt zonder verhaalreden.

## 2. Consistentie van sprekers (Grieks personage spreekt Grieks, Romeins Latijn)

Gecontroleerd tegen de vaste regel uit `Chronica.md` §7.16 (elke hoofdstuklijn
is Latijns- óf Grieks-verteld, personen spreken de taal van hun eigen
verteltraditie):

| Fragment | Verteltraditie hoofdstuk/scène | Taal fragment | Consistent? |
|---|---|---|---|
| CH2_S06 (Iuppiter fulmen misit) | H2, Latijns-verteld (Semele-lijn) | Latijn | ✅ |
| CH3_IO14 (Χαῖρε, Athena) | H3, Grieks-verteld | Grieks | ✅ |
| CH3_H25 (Νικῶ, Herakles) | H3, Grieks-verteld | Grieks | ✅ |
| CH4_T13 (Icare!) | H4, Latijns-verteld (Theseus/Ikaros) | Latijn | ✅ |
| CH5_026 (ὕπνε, ἐλθέ, Medea) | H5, Grieks-verteld (Argonauten) | Grieks | ✅ |
| CH6_008 (Sfinx) | H6, **bevestigd Latijns-verteld** ondanks Griekse mythe-oorsprong (Diana i.p.v. Artemis, zie `Chronica.md` §7.16) | Latijn | ✅ (bewust, gedocumenteerd) |
| CH7_005 (τῇ καλλίστῃ) | H7, Grieks-verteld | Grieks | ✅ |
| CH8_EPI_001 (Πάτροκλος ἀπέθανεν) | H8, Grieks-verteld | Grieks | ✅ |
| CH9_TRO_009 (Sinon) | H9, Trojaanse kant, Latijn-verteld | Latijn | ✅ |
| Alle 13 leesvallen | zie Fase 1-lijst | wisselt met hoofdstuk-traditie mee | ✅ (H2/4/6/9-Trojaans = Latijn, H3/5/7/8/9-Grieks = Grieks) |
| "Ecce" (Boodschapper, 14x) | alle hoofdstukken | altijd Latijn | ✅ **bewust inconsequent** — zij staat buiten elke specifieke traditie (kaderfiguur), dit is expliciet zo beargumenteerd in §7.16 en dus geen fout maar een uitzondering met reden. |

**Geen inconsistenties gevonden.** Dit is opvallend sterk voor een project
van deze omvang (607 scènes) — de eerdere Romeins/Grieks-naamgevingsfixes
waar `Chronica.md` naar verwijst (regel 2422-2424) zijn kennelijk goed
doorgevoerd en blijven consistent tot en met Hoofdstuk 10.

## 3. Begrijpelijkheid zonder vertaling (de echte i+1-toets)

Dit overlapt met Fase 2 §2 (dekking), maar de vraag hier is net iets anders:
niet "kent de speler elk woord al", maar "kan de speler de **betekenis**
raden uit context, zonder de woorden te kennen?" Beoordeling per categorie:

- **Leesvallen (13)**: **nee, structureel niet** — en dat is het hele punt.
  Een leesval is precies ontworpen om NIET uit context af te leiden te zijn
  zonder de grammaticale valkuil te doorzien (zie Fase 7 voor de aparte
  toetsing van "kan een speler die geen woord Latijn/Grieks kent, toch
  raden?"). Dit is geen minpunt binnen déze fase, wel relevant voor Fase 7.
- **Gloss-fragmenten met vangnet (26)**: ja, want er ís een gloss — maar
  zonder de gloss te tappen scoort het merendeel (zie Fase 2 §2, veel
  fragmenten op 0-33% "al bekend") slecht op zelfstandige afleidbaarheid.
  Concreet: "Multa nox erat, cum vela dedimus" (CH10, 0% bekende woorden) is
  zonder gloss niet af te leiden; "Icare!" (CH4, roep tijdens een val) is dat
  wél, puur door de dramatische context (een naam + uitroepteken tijdens een
  valscène behoeft geen taalkennis).
- **Sfeerlaag ("Ecce"/"Χαῖρε")**: ja, vrijwel altijd — de context
  (Orakel-opening/-afsluiting, of Athena die het woord neemt) maakt de functie
  van het woord (aandachtstrekker/groet) invoelbaar zonder vertaling nodig te
  hebben, ook al kent de speler het woord zelf niet.

## 4. Hoeveelheid — is er genoeg taal om van onderdompeling te spreken?

**Gemeten in Fase 1: 99 woordvormen, 86 unieke woorden, verspreid over 10
hoofdstukken (607 scènes).** Ter vergelijking (eerlijke, ruwe schatting, geen
gemeten cijfer): een gemiddelde lesweek Latijn/Grieks in de onderbouw
behandelt al snel een leestekst van 40-80 nieuwe of vervoegde woordvormen
**per les**, meerdere lessen per week. Tien hoofdstukken Chronica Classica
(die samen waarschijnlijk vele uren speeltijd beslaan, gezien 607 scènes)
leveren dus, in puur ongeglosde/leesval-Latijn-Grieks, ongeveer **de
hoeveelheid van één lesweek van de reguliere methode** — verspreid over het
hele spel. Dat is, eerlijk gezegd, te weinig om zelfstandig van
"onderdompeling" te kunnen spreken in de zin van B.2 (een taal die je
gebruikt om iets te doen). **Dit bevestigt de kernconclusie van Fase 2**:
het huidige mechanisme is een goed werkend, consistent, functioneel systeem
op kleine schaal — niet (nog) een onderdompelingslaag op de schaal die het
concept vereist.

De 93 `SP_VOCAB_ENTRIES` + 71 `SP_PUZZLES` voegen daar een aanzienlijke
hoeveelheid *geïsoleerde* woordenschat/grammatica aan toe, maar dat is per
ontwerp geen onderdompeling (het zijn losse vragen), dus telt hier niet mee.

## 5. Uitspraak en klank

**Volledig afwezig, en dat is een echt gemis.** Het spel heeft wel een
werkende audio-infrastructuur (`MUSIC:`-sectie, `spPlayMusic()`,
`certamen/assets/chronica/music/`+`/sfx/`, zie `Chronica.md` §7.4) maar
**geen enkele gesproken Latijnse of Griekse tekst** — geen audiobestanden bij
de gloss-fragmenten of leesvallen, geen tekst-naar-spraak. Voor een concept
dat zich expliciet op "Levend Latijn" (Porton/Addisco) beroept, waarbinnen
gesproken taal een kernonderdeel is, is dit het duidelijkste ontbrekende
stuk. Gezien de offline-first/geen-extra-CDN-eis (`CLAUDE.md`) is een
ingebakken TTS-engine niet triviaal, maar een klein aantal **voorgesproken
audiofragmenten** (alleen voor de 39 leesval/gloss-zinnen, dus een beheersbare
hoeveelheid) via het al bestaande `assets/chronica/`-mechanisme zou haalbaar
zijn zonder de architectuur te breken.

**Beslissing (2026-07-29, Gerben)**: dit vervolgvoorstel (Fase 10 #11) is
ingetrokken — voorgesproken audio is voor dit project niet haalbaar en niet
relevant. De bevinding zelf (uitspraak/klank ontbreekt) blijft hierboven
staan als eerlijke constatering, maar zonder een concreet actiepunt.

## 6. Vermijden van vertaalreflexen

**Grotendeels gelukt.** Geen van de 39 fragmenten vraagt de speler om te
*vertalen* — de leesvallen vragen om een keuze tussen twee interpretaties (dat
is *begrijpen*, geen vertaalvaardigheid an sich), en de gloss-fragmenten
geven de vertaling al cadeau bij het tappen (geen vertaalopdracht). De enige
plek waar wél impliciet vertaald wordt, is in `SP_PUZZLES`
(multiple-choice/typed-Latin/typed-Greek-vragen) — maar dat is per ontwerp
grammaticatoetsing (zie Fase 5), niet de doorlopende tekst, dus buiten scope
van "vertaalreflex in het lezen" zoals deze fase bedoelt.

## Samenvattend oordeel Fase 6

| Criterium | Oordeel |
|---|---|
| Functionaliteit | Sterk — geen oefeningen-in-vermomming |
| Sprekerconsistentie | Sterk — geen inconsistenties gevonden in 10 hoofdstukken |
| Begrijpelijkheid zonder vertaling | Wisselend, meestal zwak zonder gloss (zie Fase 2) |
| Hoeveelheid | **Zwak — de kern-tekortkoming van het hele systeem** |
| Uitspraak/klank | **Afwezig** |
| Vertaalreflexen | Sterk vermeden |
