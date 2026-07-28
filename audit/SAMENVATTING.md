# Samenvatting — Reactiviteitsaudit Chronica Classica

> Volledige onderbouwing in `audit/00` t/m `audit/11`. Niets in fase 0-9 is gewijzigd; fase 10
> voegde uitsluitend een nieuw validatiescript toe, op een aparte branch
> (`chronica-audit-fase10-opschoning`), nog niet gemerged.

## De vijf belangrijkste bevindingen

**1. Het spel is technisch schoon; het probleem zit volledig in het ontwerp.** Fase 10 vond nul
dode code, nul kapotte verwijzingen, nul wees-payoffs, robuuste foutafhandeling en impliciete
savecompatibiliteit. Alles wat hierna volgt is geen bug — het is een spel dat consequent kiest om
niet terug te lezen wat het zelf al heeft weggeschreven.

**2. Van de 669 keuzeregels in het spel hebben er 10 een gevolg dat ergens anders daadwerkelijk
wordt uitgelezen — 1%.** 31 van de 45 flags zijn dood, en 29 daarvan volgen letterlijk hetzelfde
patroon: een STAT-gated routekeuze die drie scènes lang bevestigd wordt en daarna voorgoed
verdwijnt. Dit is één herhaalde ontwerpbeslissing, geen 29 aparte missers — en dus ook met één
ingreep grotendeels op te lossen (zie B17, de eerste stap ernaartoe).

**3. `ingenium` — de stat die letterlijk "kennis, talen, tekst en raadsels" betekent — wordt in
het hele spel nul keer als drempel gebruikt,** terwijl het spel 71 taalpuzzels bevat en Gerben
zelf al op 2026-07-24 een oplossing hiervoor had vastgelegd (de Latijn/Grieks-leestest direct in
de verhaaltekst, `Chronica.md` §11.4a) die nog nooit is gebouwd. Dezelfde blinde vlek verklaart
waarom de Cavalerist (zijn hoogste stat) na Hoofdstuk 4 mechanisch verdwijnt: negen STAT-gates in
Hoofdstuk 7-9 samen, waarvan hij er nul haalt.

**4. Hoofdstuk 8 bewijst dat het spel het kán.** Het scoort 13 van de 21 reactiviteitspunten —
meer dan het dubbele van het gemiddelde (7,1) — puur omdat het als enige hoofdstuk een keuze laat
schrijven, negen relaties laat verschuiven, en een personage daar zestien scènes later ongevraagd
op laat terugkomen. Alle drie die mechanismen bestaan al in de engine. Ze zijn negen keer niet
gebruikt.

**5. De goedkoopste, grootste kans van het hele spel ligt braak: de Eed van Tyndareos** (nu 21
regels, één doorklikknop) is het mythologische fundament voor zowel de payoffs in Hoofdstuk 8/9
als een heel "bondgenoten als eindkapitaal"-systeem voor de Odyssee — en kost relatief weinig om
uit te breiden. Vlak daarachter: veertien benoemde helden op de Argo (Hoofdstuk 5) leveren
vandaag exact nul relaties op, terwijl twee van hen (de vaders van Ajax en Diomedes) al een score
hebben in latere hoofdstukken.

## De tien beste voorstellen (impact/werk, zie `audit/11-backlog.md` voor de volledige lijst)

| # | Voorstel | Impact | Werk |
|---|---|---|---|
| B01 | Hoofdstuk-verwijzingen uit de verteltekst vervangen (8 scènes, 1 sjabloon) | 3 | 1 |
| B02 | Palladium en de boog van Heracles traceerbaar maken | 3 | 1 |
| B03 | Relatieknoop Nestor + Telamon bij de Argo-bemanning | 3 | 1 |
| B04 | Punten van geen terugkeer diegetisch voelbaar maken (`CH1_000`, `CH9_005`) | 3 | 1 |
| B05 | Diomedes en Glaucus: de wapenruil (Ilias 6) | 4 | 2 |
| B06 | Vijf sterfmomenten krijgen een flag (Tydeus, Patroklos, Hector, Achilles, Aias) | 4 | 2 |
| B07 | Relatieknoop Aeneas bij zijn vlucht uit Troje | 4 | 2 |
| B08 | Scènetitels "Het Einde van Hoofdstuk N" herzien | 2 | 1 |
| B09 | Toast-teksten herstellen (statpunt, ontgrendeld, "Battle Mode") | 2 | 1 |
| B10 | Unlock-hook toevoegen aan `CH8_EPI_004` (Vulcanus' nieuwe harnas) | 2 | 1 |

**Eervolle vermelding buiten de strikte ratio:** de Eed van Tyndareos uitbreiden (impact 5, werk
3) — zie `audit/03-ontbrekende-cast.md` §2a voor de volledige uitwerking in vijf scènes.

## Met één week

Ik zou B01 t/m B10 doen — samen nog geen twee dagen werk, en ze raken zes van de negen
hoofdstukken. Daarna de Eed van Tyndareos (B11), omdat elke latere payoff in Hoofdstuk 8, 9 en de
Odyssee er sterker van wordt. De resterende dagen zou ik besteden aan B17 (goedkeuring in het
moment) — het enige punt waar het spel structureel bijna nul op scoort (fase 2, kolom 5: 0,8/3
gemiddeld) én dat zonder nieuwe architectuur te bouwen is, puur door `spHookApproach()`'s eigen
resultaat één zin lang zichtbaar te maken. Wat ik bewust zou laten liggen: de twee grote ingrepen
(B18 bondgenoten-als-eindkapitaal, B29 de vier-uitkomsten-ladder) — beide raken het hele spel
tegelijk en verdienen een eigen beslissing, geen weekend-toevoeging.
