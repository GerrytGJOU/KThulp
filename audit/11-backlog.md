# Fase 11 — Backlog

> Gesorteerd op impact/werk. Impact en werk beide 1-5. "Grote ingrepen" (impact 5, veel werk)
> staan apart aan het eind, met één expliciete uitzondering direct na de top 10 — zie de
> toelichting daar.

## De tien beste verhoudingen

| # | Titel | Type | Waar | Wat de speler ervaart | Impact | Werk | Afhankelijk van |
|---|---|---|---|---|---|---|---|
| B01 | Hoofdstuk-verwijzingen vervangen | stijl of immersie herstellen | 8 scènes, fase 8 §2a — 7 van de 8 delen dezelfde formule | Ik hoor nooit meer een personage het woord "Hoofdstuk" gebruiken; de wereld blijft de hele tijd de wereld. | 3 | 1 | — |
| B02 | Palladium en de boog van Heracles traceerbaar maken | echo toevoegen | `CH9_GRI_009`/`TRO_007` (Palladium), `CH9_GRI_007`/`TRO_005` (boog) | Twee voorwerpen die de tekst nu al belangrijk noemt, kunnen straks ook echt herkend worden wanneer ze terugkeren. | 3 | 1 | — |
| B03 | Relatieknoop Nestor + Telamon bij de Argo-bemanning | echo toevoegen | `CH5_004`/`020`, fase 3 §2b | Twee helden die ik op het schip hielp, onthouden dat later — net als Diomedes nu al doet. | 3 | 1 | — |
| B04 | Punten van geen terugkeer diegetisch voelbaar maken | kantelpunt toevoegen | `CH1_000`, `CH9_005` | Ik voel, zonder dat het spel het met zoveel woorden zegt, dat deze keuze niet meer terug te draaien is. | 3 | 1 | — |
| B05 | Diomedes en Glaucus: de wapenruil | vertakking toevoegen | Tussen `CH8_AGA_004`/`005`, fase 4 §2.1 | Ik zie voor het enige moment in het spel een Trojaan die geen vijand is — en waarom niet. | 4 | 2 | — |
| B06 | Vijf sterfmomenten krijgen een flag (Tydeus, Patroklos, Hector, Achilles, Aias) | echo toevoegen | Fase 5 §2b | Later, in de onderwereld, kunnen deze schimmen me herkennen voor wat ze weten dat ik heb gezien. | 4 | 2 | — |
| B07 | Relatieknoop Aeneas bij zijn vlucht | NPC toevoegen | `CH9_TRO_017`, fase 5 §1 | De hoofdpersoon van het volgende hele boek onthoudt of ik hem heb geholpen zijn familie te redden. | 4 | 2 | — |
| B08 | Scènetitels "Het Einde van Hoofdstuk N" herzien | stijl of immersie herstellen | 9 titels, fase 8 §2b | Elk hoofdstukslot krijgt een titel die bij het verhaal hoort, niet bij de spelstructuur. | 2 | 1 | — |
| B09 | Toast-teksten herstellen (statpunt, ontgrendeld, Battle Mode) | stijl of immersie herstellen | `singleplayer.js:1424/1439/1451`, fase 8 §2c | De korte meldingen die ik tussendoor zie, klinken nooit meer als een spelmenu. | 2 | 1 | — |
| B10 | Unlock-hook toevoegen aan `CH8_EPI_004` | uitrusting verplaatsen of verankeren | `CH8_EPI_004`, fase 6 | Het nieuwe harnas en schild die Vulcanus voor Achilles smeedt, verschijnen ook echt op mijn eigen avatar. | 2 | 1 | — |

## Eén expliciete uitzondering op de ratio

**B11 — De Eed van Tyndareos uitbreiden tot een volwaardig verzamelmoment** (impact 5, werk 3,
verhouding 1,67 — net buiten de strikte top 10, maar de grootste enkele kans van de hele audit).
Fase 3 §2a werkt dit volledig uit: vijf scènes, 6-10 flags/relaties, en het is het mythologische
fundament voor zowel de Odyssee-payoffs (fase 5) als een toekomstig "bondgenoten als eindkapitaal"-
systeem (fase 9 §3, zie B18 hieronder). Genoemd hier apart omdat de ratio het net buiten de top 10
houdt, terwijl de inhoud het er nadrukkelijk bovenaan zou zetten.

## De rest van de backlog

| # | Titel | Type | Waar | Wat de speler ervaart | Impact | Werk | Afhankelijk van |
|---|---|---|---|---|---|---|---|
| B12 | Combat-scherm systeemtaal herstellen ("Gevecht", "EP", "levenspunten") | stijl of immersie herstellen | `singleplayer.js:1883-1897`, fase 8 §2c | Een gevecht voelt als een scène uit het verhaal, niet als een apart spelscherm. | 3 | 2 | — |
| B13 | Codex-tekstvarianten op basis van opgebouwde houding (Iphigenia, Helena, Theseus' zeilen, Kallisto) | echo toevoegen | `CH7_017`, `CH7_012`, `CH4_T15`, `CH2_K07`, fase 4 §1.1-1.4 | Wat de Codex over deze momenten vastlegt, weerspiegelt hoe ik zelf door het verhaal ben gegaan. | 3 | 2 | — |
| B14 | Wapenkeuze ook als flag opslaan, niet alleen als titel | techniek opruimen | `spHookReward`, fase 6 §8 | Toekomstige personages kunnen ooit merken welk wapen ik uit de kist nam — nu kan dat nergens. | 3 | 2 | — |
| B15 | Codex-entries voor Eurystheus, Chiron, Hylas, Agave, Tiresias | NPC toevoegen | Fase 3 §1 | Personages die al een hele scène hebben, krijgen ook een eigen bladzijde in de Codex. | 2 | 1 | — |
| B16 | Apsyrtus toevoegen aan de terugreis van de Argo | vertakking toevoegen | Tussen `CH5_027`/`028`, fase 4 §4.1 | Ik zie al in Hoofdstuk 5 waartoe Medea bereid is, in plaats van er in Hoofdstuk 5 door verrast te worden. | 3 | 2 | — |
| B17 | Goedkeuring/afkeuring in het moment na houdingskeuzes | mechanisme bouwen | Generiek, fase 9 §1 | Een aanwezig personage reageert meteen, kort, op wat ik net deed — niet pas hoofdstukken later. | 4 | 3 | — |
| B18 | Bondgenoten als eindkapitaal | mechanisme bouwen | Fase 9 §3 | Wie ik onderweg steunde, staat merkbaar naast me op het moment dat het ertoe doet. | 5 | 5 | B11 |
| B19 | Helena bij het houten paard | vertakking toevoegen | `CH9_TRO_012`/`013`, fase 4 §2.2 | Voor het eerst is Helena's eigen loyaliteit oprecht onduidelijk, in plaats van dat ze passief ondergaat. | 2 | 2 | — |
| B20 | Briseis krijgt een eigen regel | stijl of immersie herstellen | `CH8_EPI_005`, fase 4 §2.3 | De vrouw om wie de hele ruzie draait, is voor het eerst ook zelf even aan het woord. | 1 | 1 | — |
| B21 | Leesvallen in een nieuwe passieve taallaag | talige laag toevoegen | Generiek, fase 7 §5b | Wie goed leest, doorziet een valkuil in het Latijn/Grieks zelf; wie gokt, krijgt een ander vervolg. | 3 | 3 | B23 |
| B22 | Glosbeleid (in-tekst, aanklikbaar, optioneel) | talige laag toevoegen | Generiek, fase 7 §5c | Vertaalhulp is er zodra ik hem wil, zonder dat hij wordt opgedrongen. | 2 | 2 | B23 |
| B23 | Passieve taallaag opbouwen (NPC-zinnen in Latijn/Grieks) | talige laag toevoegen | Generiek, fase 7 §5a/d/e | Ik hoor personages af en toe echt Latijn of Grieks spreken, en versta het steeds meer naarmate het verhaal vordert. | 4 | 4 | — |
| B24 | Instelbaar taalspoor (Latijn/Grieks/beide) vanaf Hoofdstuk 10 | talige laag toevoegen | Fase 7 §6 | Als ik maar één taal doe, sluiten de puzzels en gevechten daarna precies op mijn eigen vak aan. | 4 | 4 | B23 |
| B25 | Combat-bridge-vocabulaire filteren op taalspoor | dode flag repareren | `spCombatNextQuestion`, fase 7 §2b | Een gevechtsvraag gaat nooit meer over een woord dat ik nooit heb geleerd. | 3 | 2 | B24 |
| B26 | Lijkspelen voor Patroklos | vertakking toevoegen | Tussen `CH8_EPI_004`/`005`, fase 3 §2d, fase 4 §5 | Ik maak het grootste feestmoment van de hele Ilias zelf mee, niet alleen de rouw errond. | 3 | 4 | — |
| B27 | NPC-afsluitmomenten in de Odyssee/Aeneis | mechanisme bouwen | Fase 9 §6 | Bondgenoten die ik lang geleden leerde kennen, krijgen een eigen, herkenbaar einde. | 4 | 4 | B11, B23 |
| B28 | Rolverdeling in een climax | mechanisme bouwen | Fase 9 §4 | Ik wijs zelf de juiste bondgenoot voor de juiste taak aan, en het maakt uit of ik dat goed inschat. | 4 | 4 | B18, B27 |

## Grote ingrepen (impact 5, veel werk — apart te beslissen)

| # | Titel | Waarom dit apart hoort | Impact | Werk |
|---|---|---|---|---|
| B18 | Bondgenoten als eindkapitaal (zie boven) | Raakt bijna elk toekomstig hoofdstuk; vraagt een nieuw soort climax-logica die nu nergens bestaat. | 5 | 5 |
| B29 | De vier-uitkomsten-ladder (`CHECK:`) en de directe Latijn/Grieks-leestest in de tekst | **Al door Gerben zelf vastgelegd** (`Chronica.md` §11.4/§11.4a, 2026-07-24) als toekomstig bouwitem, en onafhankelijk door deze audit aanbevolen (fase 2 §"is falen interessant", fase 4 §4.2, fase 7 §5b). Dit is de enige manier om "falen bestaat niet" (het zwakste punt uit fase 2) structureel op te lossen — scène voor scène zou 71 puzzels en 15 gevechten vragen. | 5 | 5 |

**Waarom deze twee en niet meer:** elk ander voorstel met impact 5 (Eed van Tyndareos, B11) blijkt
bij nader inzien behapbaar genoeg om buiten deze categorie te vallen. B18 en B29 zijn structureel
van aard — ze veranderen een mechanisme voor het hele spel tegelijk, niet één scène of hoofdstuk —
en verdienen daarom een aparte beslissing los van de rest van deze lijst.
