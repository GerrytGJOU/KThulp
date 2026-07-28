# Fase 9 — Mechanismen die we nog niet hebben

> `Chronica.md` §11-12 blijkt bij het schrijven van deze fase al een uitgebreid, gedateerd
> besluitenlogboek te bevatten over precies dit onderwerp — geschreven vóórdat deze audit
> begon. Waar dat logboek een mechanisme al bespreekt, vat ik het hier samen en verwijs ik
> ernaar in plaats van het over te doen; waar dit rapport tot een andere afweging komt, staat
> dat expliciet vermeld.

## 1. Goedkeuring en afkeuring in het moment

**Bestaat niet.** Geen enkele keuze in het spel krijgt een onmiddellijke, zichtbare reactie van
een aanwezige NPC — geen knik, geen frons, geen half-zin. De dichtste benadering is
`CH2_L07B`, waar Athena's gezicht "iets minder gesloten" wordt na een Gratia-keuze — precies
één keer in 476 scènes.

**Past dit bij Chronica Classica? Ja, en het is goedkoop.** De speler is een reiziger die
overwegend *toekijkt* (fase 2: "kan de speler het gevolg zien" scoort structureel hoger dan
"heeft de wereld een mening") — dus dit mechanisme sluit aan bij wat het spel al doet, het moet
alleen vaker. Concreet: een korte, cursieve regel na een houdingskeuze, zoals de Boodschapper of
een aanwezige NPC al "en passant" reageert, zonder een apart UI-element. Geen nieuw mechanisme
nodig — dit is `spHookApproach()` die zijn eigen resultaat één zin lang zichtbaar maakt, in
plaats van stil te blijven.

## 2. Onderlinge gesprekken

**Bestaat vrijwel niet.** `CH1_B06B` is het enige moment waar NPC's een mening over *elkaar*
hebben (Ares' jaloezie, Hera's berekening, Hermes' plezier bij Athena's geboorte) — maar geen van
die meningen wordt ooit door een spelerskeuze beïnvloed.

**Kritisch: dit past deels, en is duur.** Een systeem waarin NPC's structureel van mening over
elkaar veranderen op basis van spelerskeuzes vraagt een eigen relatie-tussen-NPC's-datamodel
(niet alleen speler↔NPC, ook NPC↔NPC) — dat bestaat nergens in de huidige architectuur en zou een
aanzienlijke uitbreiding van `SP_STATE` vergen. Voor een spel dat vooral lineaire mythe navertelt
(de meeste NPC-relaties onderling liggen mythologisch al vast — Hera haat Herakles sowieso, dat
verandert de speler niet) is dit minder passend dan mechanisme 1. **Voorstel: niet als
generiek systeem, wel als eenmalig, geschreven moment** — zoals het al bestaande
Diomedes/Glaucus-voorstel uit fase 4 §2.1, waar de speler een bestaand conflict tussen twee NPC's
kan beïnvloeden zonder dat er een nieuw datamodel voor nodig is.

## 3. Bondgenoten als eindkapitaal (Mass Effect 2/3-model)

**Bestaat niet, maar het fundament ligt klaar.** Het relatiesysteem (`SP_STATE.relations`,
-5..+5, al gebouwd) is functioneel identiek aan wat dit model nodig heeft. Wat ontbreekt is een
climax-moment dat de opgetelde relaties *raadpleegt om te bepalen wie er komt opdagen* — dat
bestaat nergens, ook niet in de gebouwde Hoofdstuk 8/9-payoffs, die alleen *tekst* laten variëren,
nooit *wie erbij is*.

**Past dit bij Chronica Classica? Uitstekend — en de opdracht wijst zelf al naar het antwoord.**
De Eed van Tyndareos (fase 3 §2a) is letterlijk het mythologische fundament hiervoor: wie de
speler bij de vrijerij steunde, kan in een latere climax daadwerkelijk komen opdagen, precies het
Mass Effect 2/3-patroon. Dit is geen nieuw mechanisme dat verzonnen moet worden — het is de
bestaande relatiescore die voor het eerst een **aanwezigheids-gevolg** krijgt in plaats van alleen
een **tekst-gevolg**.

## 4. Rolverdeling in een climax

**Bestaat niet.** Geen enkele scène laat de speler een taak aan een bondgenoot toewijzen.

**Kritisch: te vroeg voor dit spel, nog niet ervoor.** Dit mechanisme heeft een breed netwerk van
al opgebouwde, individueel onderscheiden bondgenoten nodig om te werken (anders is de "juiste
persoon voor de taak" een dode keuze zonder echt alternatief) — en fase 1/5 laten zien dat zelfs
de sterkste bestaande relaties (Diomedes, Aias) nu maar twee tot drie contactmomenten hebben. Mijn
advies: **wacht met dit mechanisme tot na de Odyssee/Aeneis-hoofdstukken**, wanneer er
daadwerkelijk een cast van vijf tot acht bondgenoten met eigen, onderscheiden relatiescores
bestaat (zie fase 5 §1). Eerder inzetten zou een rolverdelingskeuze opleveren tussen personages
die de speler nauwelijks kent — het tegenovergestelde effect van wat het mechanisme moet
bereiken.

## 5. Punten van geen terugkeer, expliciet gemarkeerd

**Bestaan al mechanisch, maar worden nooit als zodanig gemarkeerd.** Twee harde, onherroepelijke
momenten zijn al gebouwd: `CH1_000` (de drie lijnen van Hoofdstuk 1 sluiten elkaar voorgoed uit)
en `CH9_005` (muren/strand, komt nooit meer samen). Geen van beide krijgt een waarschuwing — de
speler ontdekt pas achteraf, of nooit, dat de deur net dicht is gevallen.

**Past dit bij Chronica Classica — met een diegetische, geen systemische oplossing.** Een
letterlijke UI-waarschuwing ("Dit is onomkeerbaar!") zou frontaal ingaan tegen fase 8's
immersie-eis. Voorstel: laat de **verteltekst zelf** het gewicht dragen, zoals goede fictie dat
altijd al doet — een korte, stemmige zin vlak vóór de keuze die het gevoel van onomkeerbaarheid
oproept zonder het woord "onomkeerbaar" te gebruiken (`CH9_005` doet dit trouwens al gedeeltelijk:
*"Deze keer komen de twee lijnen NIET meer samen"* staat alleen in het masterplan, niet in de
scène zelf — die zin, of een variant ervan, hoort in de verteltekst, niet alleen in de
documentatie).

## 6. Persoonlijke verhaallijnen per NPC met eigen afsluiting

**Bestaat niet.** Geen enkele NPC heeft een boog die apart van de hoofdplot wordt geopend, gevolgd
en afgesloten. Herakles komt het dichtst in de buurt (twee hoofdstukken, een duidelijk begin en
einde) maar zelfs hij krijgt geen aparte "afsluitscène" die los van de hoofdplot over hém gaat.

**Past dit bij Chronica Classica, maar is afhankelijk van fase 3/5.** Dit mechanisme heeft
precies de retroactieve relatiescores nodig die fase 3 (Tyndareos) en fase 5 (Nestor, Aeneas,
Philoktetes) al voorstellen — zonder die basis is er niets om af te sluiten. Zodra die bestaan,
is een NPC-afsluitmoment relatief goedkoop: één scène per bondgenoot, laat in het Odyssee/
Aeneis-blok, die alleen verschijnt als de relatiescore een drempel haalt.

## 7. Reactiviteit op reputatie in plaats van op één keuze

**Al besproken en bewust afgewezen — met een goede reden, die nog steeds standhoudt.**
`Chronica.md` §12.1-12.2 documenteert dat het oorspronkelijke Game Bible-ontwerp een 4-assig
waardenprofiel kende (Pietas/Virtus/Astutia/Eloquentia), en dat Gerben op 2026-07-24 bewust koos
voor het huidige 1-assige Clementia/Severitas-systeem in plaats daarvan — met als reden dat een
retrofit van de toen al ~90 bestaande houdingskeuzes te duur zou zijn, en dat Astutia/Eloquentia
al gedekt worden door de nieuwe D&D-stats (Agilitas/Prudentia resp. Gratia/Ingenium), die iets
anders meten (capaciteit, geen reputatie) en dus geen apart systeem hoeven te worden.

**Mijn toevoeging vanuit deze audit: die beslissing was juist, maar het huidige ene-as-systeem
wordt zelf al bijna niet gebruikt.** Fase 1/2 laten zien dat `{tendency_address}` — de enige
plek waar Clementia/Severitas ooit zichtbaar wordt — in de hele game **vier keer** voorkomt,
tegenover 98 houdingskeuzes die er nooit toe leiden. Het probleem is dus niet dat er te weinig
assen zijn; het is dat de ene as die er is, negenennegentig procent van de tijd niets doet. **Ik
sluit me aan bij de bestaande beslissing** (geen vierde as) en verwijs naar mechanisme 1
hierboven en naar fase 4 §1.1-1.4 (de Codex-tekstvarianten op basis van `spApproachTendency()`)
als de goedkoopste manier om de bestaande as eindelijk te laten renderen.

## 8. Sterfelijkheid van bondgenoten, met afwezigheid in plaats van stille vervanging

**Deels aanwezig, nergens structureel.** Personages sterven wel (fase 5 §2a telt er 24 in
Hoofdstuk 1-9), maar niemand van hen was ooit een "bondgenoot" met een relatiescore vóór zijn
dood (Aias is de enige met een relatiescore die ook sterft, en dat gebeurt via mythologisch vaste
timing, niet spelersinvloed). Er is dus geen precedent van een bondgenoot die *afwezig blijft*
in latere scènes in plaats van stilzwijgend te worden vervangen — simpelweg omdat er nog geen
bondgenoten bestaan die lang genoeg meelopen om te kunnen sterven ná opgebouwde geschiedenis.

**Past dit bij Chronica Classica? Thematisch uitstekend, technisch wacht het op mechanisme 3/6.**
Dit is precies het punt waar het spel — zodra de Eed van Tyndareos en de Odyssee/Aeneis-relaties
bestaan — zijn sterkste mogelijke moment kan bouwen: een bondgenoot die de speler in Hoofdstuk 7
steunde, kan in een latere oorlogsscène niet meer verschijnen omdat hij inmiddels is gesneuveld —
zichtbaar afwezig, niet stilzwijgend vervangen. Nog niet te bouwen vóór de onderliggende
relatiedata bestaat.

---

## Samenvattend: volgorde van afhankelijkheid

Vijf van de acht mechanismen (3, 4, 6, 8, en gedeeltelijk 2) hangen af van dezelfde onderliggende
stap: een bredere, retroactieve laag van NPC-relatiescores die fase 3 en fase 5 al voorstellen.
**Twee mechanismen (1 en 5) zijn nu al, zonder enige voorwaarde, te bouwen** — ze hergebruiken
uitsluitend bestaande data (`SP_STATE.approach`, de al bestaande onherroepelijke keuzemomenten) en
vragen alleen om tekst, geen nieuwe architectuur. Mechanisme 7 is al correct besloten en vraagt om
geen actie buiten "gebruik wat er al is". Zie fase 11 voor de prioritering hiervan in de backlog.

Eén observatie die buiten de acht mechanismen valt maar wel relevant is: `Chronica.md` §7.12
onthult dat de uiteindelijke hoofdtegenstander van heel Chronica Classica **Lethe** is — de
personificatie van vergetelheid zelf, die gelooft dat "alles bewaren betekent dat niets meer
betekenis heeft". Dat maakt de kernbevinding van deze hele audit — dat het spel op dit moment
zelf nauwelijks onthoudt wat de speler doet — toevallig tot een bijna letterlijke echo van zijn
eigen, nog ongebouwde eindbaas.
