# Dode Flags — bewaarlijst voor de Finale

> **Doel van dit bestand**: geen enkele flag die een speler ooit zet, mag
> voorgoed stil blijven liggen. Op Gerbens verzoek (2026-08-11) moet elke
> "dode flag" (een FLAG die wél gezet wordt, maar nergens in een latere
> scène wordt uitgelezen) uiteindelijk in de Finale worden teruggehaald —
> al is het maar met één losse, korte opmerking. Dit bestand is de
> bewaarlijst waaruit de Finale-scène(s) straks putten.
>
> **Dit is een momentopname, geen vaste bron van waarheid.** De echte,
> altijd actuele lijst genereer je met:
> ```
> node certamen/tools/validate_chronica.js
> ```
> en dan de regels die met `Dode flag:` beginnen. Draai dat commando
> **opnieuw vlak vóór je aan de Finale begint** (Boek VI/Hoofdstuk 29+) en
> werk dit bestand bij met alles wat er in de tussentijd is bijgekomen —
> elk nieuw hoofdstuk introduceert er vrijwel gegarandeerd een paar.
>
> **Werkwijze bij elk nieuw hoofdstuk**: als je een FLAG zet die je (nog)
> nergens uitleest, voeg 'm hier toe in de juiste categorie, met een
> korte omschrijving van wat de flag betekent — dan hoeft niemand later te
> reconstrueren waar `ch23_iets_geheimzinnigs` ook alweer voor stond.

---

> **GROTENDEELS OPGELOST (2026-08-16, Hoofdstuk 28 "De Bibliotheek van
> Mnemosyne", geschreven maar nog niet gekoppeld)**: Categorie 1 t/m 4
> hieronder, plus de flavour-only flags uit Categorie 5/6
> (`ch20_lat_dumnorix`, `ch20_lat_aquilifer`, `ch21_lat_verres_stijl`,
> `ch21_lat_catilina_aanpak`) en de volledige "onthoud of laat
> los"-reeks uit Categorie 7/8 (`ch24_gre_*`, `ch24_lat_*`,
> `ch25_gre_atomos`, `ch25_lat_plinius`) zijn nu afbetaald via H28's vier
> vleugels — Categorie 1 exact zoals hier al aanbevolen (één verzamelende
> reflectiescène, `CH28_WING_A_001`), Categorie 2-4 en de genoemde
> flavour-flags via `CH28_WING_C_GRE`/`CH28_WING_C_LAT` (aggregaat, geen
> losse callbacks per item), de onthoud/laat-los-reeks via
> `CH28_WING_B_GRE`/`CH28_WING_B_LAT`. Zie Chronica.md §7.98 voor het
> volledige verslag. **Nog open**: de flavour-only flags van H25-27 zelf
> (`ch25_gre_filosofie`/`_eratosthenes`, `ch25_lat_graffiti`,
> `ch26_lat_vespasianus`/`_marcus_aurelius`, en alle vijf H27-flags) zijn
> in H28 niet meegenomen — die blijven kandidaat voor H29/Finale. H28
> introduceert zelf ook drie nieuwe, bewust open flags
> (`ch28_wing_*_klaar`, `ch28_eerste_vleugel`, `ch28_laatste_vleugel`) die
> GEEN gewone dode flags zijn: ze zijn expliciet bedoeld om door
> toekomstige hoofdstukken/NPC's gelezen te worden.
>
> **VERVOLG (2026-08-16, Hoofdstuk 29 "De Rivier Lethe", geschreven maar
> nog niet gekoppeld)**: sluit twee van de vier hierboven nog open
> flavour-flags alsnog af, als korte opsomming (niet als volledige scène,
> op Gerbens instructie) in `CH29_GRE_004`/`CH29_LAT_004` —
> `ch25_gre_filosofie` (Herakleitos-of-Parmenides) en
> `ch26_lat_marcus_aurelius` (de vraag bij zijn kampvuur). Daarnaast krijgt
> `ch21_lat_verres_stijl` (al "opgelost" via H28's aggregaat-vleugel) hier
> een tweede, specifieke opsomming-callback, net als het niet-in-dit-
> bestand-getrackte `ch7_vrijer_gesteund` (vrijers van Helena). **Nog
> steeds open**: `ch25_gre_eratosthenes`, `ch25_lat_graffiti`,
> `ch26_lat_vespasianus`, en alle vijf H27-flags — geen van deze paste bij
> H29's "gemiste pad"-thema (het zijn beloningen voor iets wat de speler
> WEL deed, niet iets wat gemist werd), blijven dus kandidaat voor de
> Finale zelf. H29 introduceert zelf vier nieuwe flags die GEEN gewone
> dode flags zijn maar bewuste leesvlaggen/eenmalige-scène-markers:
> `ch29_taalspoor_gemist`, `ch1_lijn`-afgeleide reflectie zonder eigen
> nieuwe flag, `ch29_gre_opsomming_gezien`, `ch29_lat_opsomming_gezien` —
> puur om te voorkomen dat een toekomstig hoofdstuk deze opsomming-scènes
> per ongeluk dubbel toont; er is geen verdere payoff voor gepland. Zie
> Chronica.md §7.99 voor het volledige verslag.
>
> **VERVOLG (2026-08-17, de Finale "Chronica Classica", inmiddels
> 2026-08-18 GEKOPPELD aan de speelbare route — zie Chronica.md §7.104)**:
> sluit de laatste vier nog open flavour-flags alsnog af
> via `FIN_HER_002`'s `{fin_dode_flags_credit}`-token —
> `ch25_gre_eratosthenes`, `ch25_lat_graffiti`, `ch26_lat_vespasianus`, en
> alle vijf H27-flags (`ch27_lat_bestuursidee`, `ch27_lat_prijzenedict`,
> `ch27_lat_milvische_brug`, `ch27_gre_milvische_brug`, `ch27_lat_route`).
> **Dit bestand is hiermee, op de bewust-open-gelaten items na (zie hieronder
> nog steeds open), volledig afbetaald.** De Finale introduceert zelf een
> handvol nieuwe flags die GEEN gewone dode flags zijn:
> `fin_kennis_gre`/`fin_kennis_lat`/`fin_kennis_score` (taal-eindtoets-
> resultaat, gelezen door `spFinaleLetheHp()`), `fin_herinnering_score`
> (berekend door `spFinaleHerinneringScore()`, zelfde doel),
> `fin_einde_variant` (pure flavour, gelezen door `{fin_einde_variant_line}`
> ná de COMBAT), `fin_tendency` (berekend door `spComputeTendencyTier()`,
> stuurt de vijf-eindes-router) en `fin_ceremonieel_harnas` (gelezen door
> `SP_AVATAR_STORY_UNLOCKS`). Geen van deze hoort ooit in de generieke
> dode-flags-lijst thuis — ze zijn stuk voor stuk bewuste, al-uitgelezen
> mechaniek-vlaggen van de Finale zelf. Zie Chronica.md §7.101 voor het
> volledige verslag. **Nog steeds open** (bewust, geen "gemiste pad"-thema
> en geen "wat ging goed"-thema, dus nergens een natuurlijke plek): de
> resterende dode NPC's uit de Odyssee/Aeneis-cast (Achilles/Dido/Kirke/
> Telemachus/Eurycleia/Penelope/Iokaste/Ariadne, zie
> [[chronica-resterende-dode-npcs-lethe-finale]] in memory) — als Gerben die
> alsnog wil meenemen, is dat een bewuste toevoeging aan een al bestaande
> Finale-scène (bijvoorbeeld de Helden-cluster in `FIN_REL_001`), geen apart
> nieuw hoofdstuk.

## Categorie 1 — Aanpak-/route-flags (welke stat/benadering koos de speler)

Grote groep flags uit Hoofdstuk 1-6, elk gezet op een scène waar de
speler een obstakel kon oplossen via een van de zes stats (agilitas/vis/
prudentia/robur/gratia/ingenium — zie de `_VIS`/`_AGI`/`_PRU`/`_ROB`/
`_GRA`-scène-suffixen). Te talrijk en te gelijksoortig voor 23 losse
Finale-momenten — **aanbevolen aanpak: één verzamelende reflectiescène**
("in de Bibliotheek van Mnemosyne herinner je je, in een flits, elke
keer dat je koos om te klimmen, te overtuigen, of gewoon je schouders
eronder te zetten") in plaats van 23 losse callbacks.

`ch1_a10_route`, `ch1_b01_route`, `ch1_c03_route`, `ch1_c04_opgemerkt`,
`ch2_l07_route`, `ch2_s06_route`, `ch2_k05_route`, `ch2_h07_route`,
`ch2_h10_route`, `ch3_io07_route`, `ch3_io11_route`, `ch3_h07_route`,
`ch3_h13_route`, `ch4_t08_route`, `ch4_t11_route`, `ch4_p06_route`,
`ch5_004_route`, `ch5_008_route`, `ch5_019_route`, `ch5_024_route`,
`ch6_001_route`, `ch6_015_route`, `ch6_023_route`

## Categorie 2 — Mythologische voltooiing/gebeurtenis-markers

Herkenbare, op zichzelf staande verhaalmomenten — goede kandidaten voor
een individuele, korte Finale-callback (herkenning, geen hele scène
nodig).

- `herakles_taken_voltooid` (CH2_H12, CH3_H25) — de twaalf werken van
  Herakles zijn voltooid.
- `dood_patroklos` (CH8_EPI_001) — Patroklos' dood in Achilles' wapenrusting.
- `dood_hektor` (CH8_EPI_008) — Hektors dood.
- `dood_achilles` (CH9_TRO_003, CH9_GRI_003) — Achilles' dood.
- `boog_heracles_bij_paris_dood` (CH9_TRO_005, CH9_GRI_007) — Heracles'
  boog (via Philoktetes) doodt Paris.
- `palladium_gestolen` (CH9_TRO_007, CH9_GRI_009) — de diefstal van het
  Palladium uit Troje.
- `ch6_diomedes_epigonen` (CH6_020) — de Epigonen (zonen van de Zeven
  tegen Thebe) nemen wraak.
- `ch7_vrijer_gesteund` (CH7_002_MEN/AIA/DIO) — welke vrijer van Helena
  de speler steunde, vóór de Trojaanse Oorlog.
- `ch7_odysseus_geholpen` (CH7_002D) — of de speler Odysseus hielp zijn
  waanzin-list te ontwijken.

## Categorie 3 — NPC-erkenning/relatie-markers (H15-16)

- `ch15_gre_doris_geholpen` (CH15_GRE_002A)
- `ch15_lat_fortunata_erkend` (CH15_LAT_002A)
- `ch15_gre_straton_argwaan` (CH15_GRE_004_GEFAALD)
- `ch15_lat_fortunata_alleen` (CH15_LAT_004_GEFAALD)
- `ch16_lat_spartacus_erkend` (CH16_LAT_003A)
- `ch16_lat_spartacus_gezien` (CH16_LAT_003J)

Alle zes: herkende de speler een terugkerend of onderscheiden NPC-moment
in Hoofdstuk 15/16 — goede kandidaten voor een korte, individuele
Finale-regel ("je herinnert je Fortunata nog, van die avond in...").

## Categorie 4 — Politieke-scheur-flags (H18-19)

- `ch18_gre_naxos_gezien` (CH18_GRE_002) — Naxos' met geweld onderdrukte
  afscheiding van de Delisch-Attische Zeebond.
- `ch18_lat_tiberius_veto` (CH18_LAT_002) — Tiberius Gracchus zet zijn
  medetribuun Octavius af, het precedent dat elk ambt opzegbaar maakt.
- `ch19_gre_ath_sicilie` (meegevaren/gebleven) — was de speler zelf bij
  de Siciliaanse Expeditie.
- `ch19_lat_pom_samenzwering` (mee/geweigerd) — deelname aan de moord op
  Caesar (alleen bereikbaar via het Pompeius-spoor).

`ch19_gre_zijde` en `ch19_lat_zijde` zijn **niet langer dood**: Hoofdstuk
20 leest ze terug via `{ch19_gre_zijde_h20_echo}`/`{ch19_lat_zijde_h20_echo}`
(zie Chronica.md §7.83). Precedent bevestigd: een grote zijde-keuze kan dus
ook zonder een volledig eigen payoff-hoofdstuk worden afbetaald, gewoon als
inleidende alinea in het eerstvolgende hoofdstuk waar dat personage
terugkeert.

## Categorie 5 — Nieuwe dode flags (H20)

- `ch20_lat_dumnorix` (executie/poging_genade) — hoe Caesar de
  Dumnorix-kwestie liet afhandelen; bewust flavour-only (Clementia/
  Severitas wordt al door de gewone approach-tracking meegenomen), geen
  personage dat later terugkeert om dit te kunnen uitlezen.
- `ch20_lat_aquilifer` (speler/onbekende_soldaat) — of de speler zelf de
  adelaar van het Tiende Legioen greep bij de Britannia-landing, of de
  (bij Caesar naamloze) aquilifer liet gaan; bewust flavour-only, geen
  personage dat dit later kan uitlezen.

## Categorie 6 — Nieuwe dode flags (H21-22, sinds hun koppeling 2026-08-14)

- `ch21_lat_verres_stijl` (logica/emotie) — Cicero's pleidooistijl in het
  Verres-proces; flavour-only.
- `ch21_lat_catilina_aanpak` (hard/zacht) — hoe de Senaat tegen Catilina
  optrad; flavour-only.

`ch22_gre_zijde` (ptolemaeus/antigonos) en `ch22_lat_zijde`
(octavianus/antonius) zijn NIET langer dood: opgelost op 2026-08-14 via
`{ch22_gre_zijde_h23_echo}` (CH23_GRE_001, bij Cleopatra's introductie —
Ptolemaeus' eigen nazaat) en `{ch22_lat_zijde_h23_echo}` (CH23_LAT_001,
bij Octavia's verstoting — het moment waarop de Octavianus/Antonius-
vriendschap breekt). Zelfde patroon als de H19-zijde-echo's in H20.

## Categorie 7 — H24's "onthoud of laat los"-flags: GEEN gewone dode flags

Hoofdstuk 24 ("Steen en Water", geschreven 2026-08-14, nog niet gekoppeld)
zet acht nieuwe FLAGs (`ch24_gre_phidias`, `ch24_gre_polykleitos`,
`ch24_gre_praxiteles`, `ch24_gre_kolossos`, `ch24_gre_fragment`,
`ch24_lat_aquaduct`, `ch24_lat_ara_pacis`, `ch24_lat_vitruvius_principe`)
die BEWUST nog nergens worden uitgelezen. Dit zijn GEEN gewone dode flags
voor de Finale-catch-all: ze hebben al een specifiek gepland thuis in
Hoofdstuk 28 ("De Bibliotheek van Mnemosyne") en 29 ("De Rivier Lethe") —
zie de volledige toelichting in de memory
`chronica-h24-lethe-mnemosyne-zaadjes`. Niet per ongeluk in de generieke
Finale-lijst opnemen als H24 gebouwd/gekoppeld wordt; check eerst of H28/29
al bestaan en de payoff daar hoort te landen.

`ch24_lat_vitruvius_principe` is NIET langer dood: opgelost op 2026-08-15
via drie `SP_PAYOFFS`-echo's op `CH25_LAT_001` (firmitas/utilitas/venustas)
zodra Vitruvius in Hoofdstuk 25 terugkeert. De overige zeven H24-flags
blijven bewust ongelezen tot H28/29.

## Categorie 8 — Nieuwe dode flags (H25, geschreven 2026-08-15, nog niet gekoppeld)

- `ch25_gre_filosofie` (herakleitos/parmenides) — welke kant de speler koos
  in het Herakleitos/Parmenides-dispuut; flavour-only, geen personage dat
  dit later terugleest.
- `ch25_gre_atomos` (onthouden/losgelaten) — Demokritos' atomos-idee;
  flavour-only.
- `ch25_gre_eratosthenes` (goed) — alleen gezet bij de correcte leesval-
  uitkomst, geen personage dat dit later uitleest.
- `ch25_lat_graffiti` (goed) — alleen gezet bij de correcte leesval-
  uitkomst, geen personage dat dit later uitleest.

`ch25_lat_plinius` (onthouden/losgelaten) is GEEN gewone dode flag: net als
H24's reeks is dit een bewust "onthoud of laat los"-zaadje voor Hoofdstuk
28/29 (Lethe/Mnemosyne) — zie de memory
`chronica-h24-lethe-mnemosyne-zaadjes` (nu ook H25 meenemend). Niet in de
generieke Finale-lijst opnemen; check eerst of H28/29 de payoff al dekken.

## Categorie 9 — Nieuwe dode flags (H26, geschreven 2026-08-15, nog niet gekoppeld)

- `ch26_lat_vespasianus` (goed) — alleen gezet bij de correcte leesval-
  uitkomst van de "pecunia non olet"-scène, geen personage dat dit later
  uitleest.
- `ch26_lat_marcus_aurelius` (stoicijn/oorlog) — welke vraag de speler aan
  Marcus Aurelius stelde; flavour-only, geen personage dat dit later
  terugleest.

`ch26_lat_vitruvius_principe`-achtige payoff-loze flags horen hier niet bij
— H26 introduceert geen nieuwe "onthoud of laat los"-reeks; die blijft
beperkt tot H24/H25/toekomstige hoofdstukken zoals gepland in de
Lethe/Mnemosyne-memory.

## Categorie 10 — Nieuwe dode flags (H27, geschreven 2026-08-16, nog niet gekoppeld)

- `ch27_lat_bestuursidee` (generaals/opvolger/provincies) — welk idee de
  speler voorstelde vóór Diocletianus de Tetrarchie onthulde; flavour-only,
  alle drie leiden non-punishing tot dezelfde onthulling.
- `ch27_lat_prijzenedict` (goed) — alleen gezet bij de correcte
  leesval-uitkomst, geen personage dat dit later uitleest.
- `ch27_lat_milvische_brug` (goed) — idem, Latijnse Milvische-Brug-leesval.
- `ch27_gre_milvische_brug` (goed) — idem, Griekse Milvische-Brug-leesval
  (Eusebius-versie).
- `ch27_lat_route` (weg/bergpas) — welke route de speler koos bij het
  verzonnen "bergpas of weg"-moment; puur sfeer, geen goed/fout, geen
  personage dat dit later terugleest.

---

**Status**: 56 dode flags vastgelegd op 2026-08-16 (na het schrijven van
Hoofdstuk 27). Bijwerken bij elk volgend hoofdstuk dat een nieuwe, nog niet
uitgelezen FLAG zet.
