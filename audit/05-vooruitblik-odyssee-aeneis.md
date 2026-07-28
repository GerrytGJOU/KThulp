# Fase 5 — Vooruitblik: Odyssee en Aeneis

> `SP_CAMPAIGN` (`certamen/singleplayer-data.js`) bevestigt de richting: Hoofdstuk 10 "Vluchten
> uit Troje" en 11 "Tussen Liefde en Lot" zijn Odyssee-hoofdstukken (Pallas les 15-18: de
> Faiaken, Polyfemos, Circe, de onderwereld), Hoofdstuk 12 "Odysseus' Wraak" sluit de Odyssee af
> (Pallas les 19-21, **geen Minerva-koppeling meer** — vanaf hier lopen de twee taalsporen al
> uit elkaar in de eigen metadata), en Hoofdstuk 13 "Het Begin van Rome" is zuiver Aeneas/Minerva
> (**geen Pallas-koppeling meer**). Die twee "—"-velden in de bestaande data zijn zelf al het
> bewijs dat vanaf hier de twee taalsporen zich splitsen — relevant voor fase 7.

## 1. Welke NPC's uit Hoofdstuk 1-9 keren terug?

Voor elk: wordt er nú genoeg bijgehouden om de terugkeer betekenisvol te maken, en zo niet —
welke flag/relatiescore moet retroactief toegevoegd, in welke bestaande scène?

| NPC | Nu genoeg bijgehouden? | Voorstel | In bestaande scène |
|---|---|---|---|
| **Odysseus** | Gedeeltelijk. Eén relatiepunt (`CH8_AGA_008`), nooit uitgelezen (fase 1 §6). | Voeg de Tyndareos-uitbreiding uit fase 3 §2a toe (`odysseus +2` bij hulp aan de eed) zodat er twee onafhankelijke bronnen zijn, net als bij Diomedes nu al. | `CH7_002C` (nieuw, fase 3), `CH8_AGA_008` (bestaand) |
| **Nestor** | **Nul.** Vier hoofdstukken (H4, H5, H8, H9), nooit een relatie (fase 1 §6b). Zijn zoon Antilochos sterft in H9 zonder dat het spel weet of de speler Nestor kende. | `RELATION: nestor=+1`-knop bij `CH5_020` (koersadvies) — voorgesteld in fase 3 §2b. | `CH5_020` |
| **Menelaus** | Eén relatiepunt per tak in `CH8_ACH_001`/`CH8_AGA_001`, nooit uitgelezen. | Geen extra bron nodig — koppel gewoon een payoff in het Odyssee-hoofdstuk (waar hij Telemachus ontvangt) aan de bestaande `menelaos`-score. | — (uitlezing pas nodig in H10+) |
| **Helena** | Geen relatiescore; wel de Codex-varianten uit fase 4 §1.2. | Gebruik `CODEX: helena_misleid`/`helena_medeplichtig` als basis voor hoe ze Telemachus in de Odyssee ontvangt (gastvrij en oprecht vs. afstandelijk en zich verdedigend). | `CH7_012` (bestaand, uitgebreid in fase 4) |
| **Neoptolemus** | Geen relatiescore. Verschijnt pas laat (H9), doodt Priamus/Astyanax en krijgt Andromache. | Geen retroactieve flag nodig — hij is nieuw genoeg dat zijn eerste indruk in H9 zelf al genoeg basis is. Wél: leg vast `RELATION: neoptolemus` op basis van hoe de speler zijn optreden in `CH9_TRO_014`/`GRI_015` becommentarieert (de bestaande houdingskeuze daar hertaggen naar een relatie in plaats van alleen Clementia/Severitas). | `CH9_TRO_015`/`GRI_015` |
| **Andromache & Helenus** | Geen relatiescore voor beiden, ondanks 7 (Andromache) en 2 (Helenus) scènes. Ze belanden samen in Epirus en ontvangen Aeneas (Aeneis 3) — relevant voor het Aeneis-spoor. | `PERSON:helenus:full` bestaat al bij zijn onthulling (`CH9_GRI_007C`); voeg daar `RELATION: helenus=?` toe op basis van of de speler in H9 de Trojaanse of Griekse tak koos (hij verraadt zijn stad — reageert een Trojaans-kant-speler daar anders op dan een Griekse-kant-speler die net won?). | `CH9_GRI_007C` |
| **Aeneas** | **Nul.** Hoofdpersoon van het hele volgende boek, twee scènes in H9 (gered door Venus in `CH8_AGA_004`, vlucht in `CH9_TRO_017`), geen enkele relatie. | Voeg bij `CH9_TRO_017` een optionele knop toe: help de speler Aeneas' familie de stad uit (`[STAT:vis:13]` of `[STAT:agilitas:13]`), en zet `RELATION: aeneas=+1`. Dit is de belangrijkste retroactieve toevoeging van deze fase — zie ook fase 3 §1 (Idomeneus, Laomedon/Hesione) voor verdere Aeneis-brugstof. | `CH9_TRO_017` |
| **Diomedes** | Goed. Relatiescore uit twee bronnen (H6, H8), uitgelezen in H9. Sterkste bestaande boog van het spel (fase 1 §3). Weigert in de Aeneis (boek 11) de Latijnen te helpen tegen Aeneas — een directe, al aangelegde haak. | Geen wijziging nodig — het mechanisme werkt al. Alleen bewaren voor de payoff in het Aeneis-hoofdstuk. | — |
| **Idomeneus** | Nul, komt nog niet voor. Zie fase 3 §1 (H9) voor de voorgestelde naamsvermelding. | Naamsvermelding volstaat nu; geen relatiescore nodig tot hij zelf een scène krijgt. | `CH9_GRI_001`/`TRO_008` (fase 3-voorstel) |
| **Antenor** | Komt nog niet voor. Zuiver een Aeneis-brugfiguur (sticht Patavium). | Geen actie nu nodig — plant hem pas in het Aeneis-hoofdstuk zelf. | — |
| **Circe** | Komt nog niet voor. | Geen actie nu nodig. | — |
| **Philoktetes** | Gedeeltelijk — vijf scènes over drie hoofdstukken (H5, H7, H9), geen relatiescore, ondanks een expliciet wrok-thema ("zijn wrok tegen de mannen die hem lieten stikken, verzacht — een beetje", `CH9_GRI_006`). | `RELATION: philoktetes`-knop bij zijn terugkeer in `CH9_GRI_006` — nu een doorklikscène. Voer een keuze in: troost hem actief, of laat de genezing zijn werk doen. | `CH9_GRI_006` |
| **Achilles' schim** | Achilles heeft al een relatiescore (`CH8_ACH_008`, nooit uitgelezen). | Direct bruikbaar zodra een nekyia-scène bestaat — zie §2. | — |
| **Ajax' schim** | Aias heeft de sterkste relatiescore van het spel (drie bronnen, uitgelezen in `CH9_GRI_005`). In de Odyssee (11.541-567) weigert zijn schim zelfs dood nog met Odysseus te spreken — een beroemd, stil moment. | Direct bruikbaar — zie §2. | — |
| **Agamemnons schim** | Eén relatiepunt (`CH8_AGA_008`), nooit uitgelezen. Sterft (niet in `SP_CAMPAIGN` t/m boek 5 verteld, maar traditioneel door Clytemnestra) vóór zijn schim in de Odyssee met Odysseus spreekt. | Direct bruikbaar — zie §2. | — |
| **Teucer** | Komt nog niet voor. Halfbroer van Aias (Telamons zoon, dus ook zoon van de al bekende Telamon uit H5). | Geen actie nu nodig — zijn introductie kan zelf al op Telamon bouwen zodra hij verschijnt. | — |
| **Telemachus** | Komt nog niet voor als personage (wel genoemd: Odysseus' zoontje bij de ploeg-list, `CH7_014`). | Geen actie nu nodig. | — |

**Samenvatting:** van de vijftien genoemde figuren hebben er twee (Diomedes, gedeeltelijk
Menelaus/Achilles/Ajax/Agamemnon via hun bestaande maar dode relatiescores) al genoeg basis.
**Nestor en Aeneas zijn de grootste gaten** — allebei hoofdrolspelers van een heel volgend boek,
allebei nul.

---

## 2. De onderwereld: de goedkoopste payoff-machine die er bestaat

Zoals de opdracht zelf al aangeeft: elke gestorven NPC kan in een nekyia-scène (Odyssee 11) of de
Aeneis-onderwereld (boek 6) terugkomen en de speler aanspreken op wat er gebeurde. Dat vraagt geen
nieuwe personages — alleen dat hun dood nu al iets vastlegt.

### 2a. Volledige inventarisatie: wie sterft (of kan sterven) in Hoofdstuk 1-9?

| Personage | Sterft in | Schrijft de dood een flag? | Bruikbaar voor een schim-scène? |
|---|---|---|---|
| Megara & kinderen | `CH2_H06` (Herakles' waanzin, off-screen) | Nee | Laag — geen eigen stem in het spel gehad |
| Hippolyte | `CH3_H17` | Nee | Laag |
| Ikaros | `CH4_T13` | Nee | Middel — emotioneel zwaar moment, maar geen eigen relatiescore |
| Aegeus | `CH4_T16` | Nee (wel `ch4_lijn_theseus`, over de hele lijn, niet specifiek zijn dood) | Middel |
| Amycus | `CH5_013`/`014` (Combat-bridge) | Nee | Laag — vijand zonder diepte |
| Niobe's 14 kinderen | `CH6_004` | Nee | Laag |
| Laius | `CH6_006` | Nee | Laag (Oedipus weet het zelf pas later) |
| Iokaste | `CH6_010` | Nee | Middel |
| Eteokles & Polyneikes | `CH6_014` | Nee | Middel |
| Tydeus | `CH6_014` | Nee | **Hoog — vader van Diomedes, die al een relatiescore heeft. Zijn schim zou in een nekyia-scène rechtstreeks tegen de speler over zijn zoon kunnen spreken.** |
| Antigone | `CH6_017` | Nee | Middel |
| Pentheus | `CH6_025` | Nee | Laag |
| Protesilaus | `CH7_019` | Nee | Laag — geïntroduceerd en gestorven in dezelfde scène |
| Patroklos | `CH8_AGA_012`/`EPI_001` | Nee | **Hoog — de speler helpt hem mogelijk verzorgen in `CH8_ACH_006_PRU` (fase 1 §4b), en die glimlach wordt nu nergens bewaard. Perfecte schim-payoff.** |
| Hector | `CH8_EPI_008` | Nee | **Hoog — Priamus' smeekbede is het emotionele hoogtepunt van H8; een latere schim-ontmoeting (of, in Aeneis 2, Deiphobus als schim die over Hectors familie spreekt) bouwt hier direct op voort.** |
| Penthesileia | `CH9_TRO_001`/`GRI_001` | Nee | Laag |
| Memnon | `CH9_TRO_002`/`GRI_002` | Nee | Laag |
| Achilles | `CH9_TRO_003`/`GRI_003` | Nee (relatiescore bestaat wel, uit H8) | **Hoog — de bestaande relatiescore kan direct de toon van zijn schim bepalen.** |
| Paris | `CH9_TRO_005`/`GRI_007` | Nee | Laag |
| Laocoön + zonen | `CH9_TRO_010` (alleen Trojaanse tak) | Nee | Laag |
| Priamus | `CH9_TRO_014`/`GRI_015` | Nee | Middel |
| Astyanax | `CH9_TRO_015`/`GRI_015` | Nee | Laag (kind, geen eigen stem gehad) |
| Aias (Telamons zoon) | `CH9_GRI_005` (alleen Griekse tak) | Nee (relatiescore bestaat, twee wederzijds exclusieve payoffs) | **Hoog — sterkste bestaande relatie van het spel, en zijn stilzwijgen tegen Odysseus in de onderwereld (Odyssee 11.541-567) is zelf al een van de beroemdste scènes van het epos.** |

**Geen van de 24 dodelijke momenten in Hoofdstuk 1-9 schrijft een flag die specifiek de dood zelf
markeert.** `ch1_lijn`/`ch2_lijn_*`/etc. markeren voltooide verhaallijnen, niet sterfgevallen.

### 2b. Voorstel: één systematische `DEATH:`-achtige flag, geen nieuwe sectie nodig

In plaats van 24 aparte ad-hoc flags: gebruik de al bestaande `FLAG:`-sectie met een vaste
naamgevingsconventie, bijvoorbeeld `dood_tydeus=true`, `dood_patroklos=true`, `dood_hector=true`,
`dood_achilles=true`, `dood_aias=true`. Dat is geen nieuw mechanisme — het is de bestaande
`spHookFlag()` toegepast op een plek waar hij nu nergens voor wordt gebruikt. De vier/vijf
"Hoog"-gemarkeerde momenten hierboven verdienen dit het eerst; de rest kan volgen zodra de
Odyssee/Aeneis-hoofdstukken daadwerkelijk gebouwd worden.

- **Kosten:** triviaal per flag (één regel in een bestaande scène), geen nieuwe scènes nodig in
  Hoofdstuk 1-9 zelf.
- **Payoff:** elke schim-scène in de nekyia (Odyssee 11) of de Aeneis-onderwereld (boek 6) kan dan
  een `[REQUIRE:...]`-achtige conditie gebruiken om te bepalen welke schimmen de speler tegenkomt
  en wat ze zeggen — inclusief het al bestaande `relations`-object voor toon (vriendelijk/bitter).

---

## 3. Voorwerpen en vloeken die meereizen

| Voorwerp | Nu behandeld als | Traceerbaar? |
|---|---|---|
| **Palladium** | Puur tekst — drie codex-vermeldingen (`codex_palladium_diefstal`, regels 1273, 1457, 1542), nooit een `INVENTORY:`- of `FLAG:`-sectie. | **Nee.** |
| **Boog van Heracles** | Puur tekst — genoemd in `CH7_018`, `CH9_GRI_006`, `CH9_GRI_007`. | **Nee.** |
| **Herakles' harnas** | De uitzondering — zie fase 1 §3: dit ís een flag (`herakles_harnas`), uitgelezen op afstand 157. Het enige voorwerp in het spel dat wél traceerbaar is. | **Ja — en het bewijst dat het kan.** |
| **Gastvriendschappen** (bv. Diomedes/Glaucus, fase 4 §2.1) | Nog niet in het spel aanwezig. | N.v.t. |
| **De gouden appel, amber, Ariadnes garen, Argus' bronssplinter, enz.** | Allemaal `SOUVENIR:`-items — verzameld, zichtbaar in de Codex, maar nergens later door een NPC herkend of door een `PUZZLE`/`PAYOFF` gelezen. | **Nee — souvenirs zijn een presentatielaag, geen speldata die het verhaal terugleest.** |

**Bevinding:** op `herakles_harnas` na wordt geen enkel voorwerp in het spel als traceerbaar
object behandeld, ook niet de twee met de grootste toekomstige lading (Palladium, boog van
Heracles — beide expliciet genoemd in het referentiedocument als "erfstuk-payoff"). Concreet:

- **`FLAG: palladium_gestolen=true`** bij `CH9_GRI_009`/`CH9_TRO_007` — triviaal toe te voegen,
  en direct bruikbaar zodra het Aeneis-hoofdstuk het Palladium naar Italië laat reizen
  (referentiedocument, Deel 3).
- **`FLAG: boog_heracles_bij_paris_dood=true`** bij `CH9_GRI_007`/`CH9_TRO_005` — sluit de keten
  die al in de tekst zelf wordt benoemd ("een wapen dat via drie verschillende handen bij hem
  terechtkwam") mechanisch af.

Beide zijn triviale toevoegingen aan bestaande scènes, geen nieuwe scènes nodig, en ze leggen
precies vast wat de verteltekst nu al beweert maar het datamodel niet vasthoudt.
