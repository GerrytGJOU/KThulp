# Fase 4 — Gemiste vertakkingen en alternatieve plotlijnen

> Per voorstel: de vertakking, waar hij weer samenkomt met de hoofdlijn, welke flags hij zou
> schrijven. Vertakkingen die niet binnen twee scènes samenkomen staan apart onderaan ("duur").
> Bij elk voorstel dat mythologisch discutabel is, staat de bron/traditie erbij.

## Eerst: wat structureel vast moet blijven

Niet alles verdient een vertakking. Deze plotpunten zijn door de mythe zelf — of door de
noodzaak van latere hoofdstukken — vastgeklonken, en ik stel voor ze zo te laten:

- **De val van Troje zelf** (Sinon overtuigt, het paard komt binnen) — nodig voor elk later boek.
- **Hectors dood, Patroklos' dood, Achilles' dood, Priamus' dood, Aias' zelfmoord** — stuk voor
  stuk vastgelegde eindpunten die latere hoofdstukken (en de Oresteia/Odyssee-lijnen) als vaststaand
  aannemen.
- **Cassandra's lot bij het altaar** — nodig voor de latere Locrische boetegang-traditie (niet in
  `SP_CAMPAIGN`, maar een bekend vervolg) en voor de stormscène die de Griekse thuisreis raakt.
- **Het Parisoordeel zelf** (Paris kiest Venus) — de hele oorlog hangt eraan; een andere uitkomst
  zou het spel fundamenteel herschrijven, niet vertakken.

Deze vier worden hieronder dus **niet** als vertakking voorgesteld, ook al kent de mythe voor
sommige (Hippolyte, zie §3) een net iets andere versie.

---

## 1. Alternatieve tradities die een vertakking kunnen worden

### 1.1 Hoofdstuk 7 — Iphigenia: wat staat er echt in de Codex?

**Huidige staat:** `CH7_017` vertelt beide tradities naast elkaar in de verteltekst zelf
("sommigen zeggen dat Diana ingrijpt... anderen zwijgen liever") zonder dat de speler iets kiest.
Dat is een goed model voor *verhalende* ambiguïteit, maar het is geen vertakking — elke speler
krijgt exact dezelfde tekst.

**Voorstel:** koppel de twee tradities aan de opgebouwde Clementia/Severitas-houding
(`spApproachTendency()`, al bestaand en tot nu toe onderbenut, zie fase 1 §7 en fase 2). Een
speler met een Clementia-overwicht leest de Diana-redt-haar-versie als de versie die de Codex
vastlegt (`CODEX: iphigenia_gered`); een Severitas-overwicht legt de offer-versie vast
(`CODEX: iphigenia_geofferd`); bij een gelijke stand blijft de bestaande, dubbelzinnige tekst
staan. Geen nieuwe scène nodig — alleen een conditie op de bestaande tekst.

- **Waar hij samenkomt:** onmiddellijk — dezelfde scène, alleen de laatste alinea verschilt.
- **Flags:** `CODEX: iphigenia_gered` of `CODEX: iphigenia_geofferd`.
- **Kosten:** triviaal (tekstconditie, geen nieuwe scène).
- **Payoff later:** als de Oresteia/Tauris-stof ooit gebouwd wordt (niet in `SP_CAMPAIGN` t/m
  boek 5), bepaalt deze flag of Iphigenia daar kan terugkeren. Zie fase 5.

### 1.2 Hoofdstuk 7 — De schaking van Helena: wie krijgt de Codex-versie?

Zelfde mechaniek als 1.1, toegepast op `CH7_012`. Clementia-overwicht legt vast dat Helena
misleid/verliefd werd; Severitas-overwicht legt vast dat de bronnen haar medeplichtig achten.
Dit heeft een groter mythologisch precedent dan 1.1: Herodotos (*Historiën* 2.113-120) verdedigt
haar onschuld met een heel eigen Egypte-verhaal, tegenover de Ilias die haar grotendeels
medeplichtig veronderstelt.

- **Waar hij samenkomt:** onmiddellijk.
- **Flags:** `CODEX: helena_misleid` / `CODEX: helena_medeplichtig`.
- **Kosten:** triviaal.
- **Payoff later:** kleurt hoe Helena in Hoofdstuk 9 (`CH9_TRO_005B`/`GRI_007B`, haar gedwongen
  huwelijk met Deiphobus) en in een eventuele Odyssee-scène met Telemachus wordt beschreven.

### 1.3 Hoofdstuk 4 — Waarom vergat Theseus de zeilen?

**Traditie:** drie verklaringen bestaan naast elkaar in de oudheid zelf — pure vergeetachtigheid
(Plutarchus, *Theseus* 22, die het zelf al "onverklaarbaar" noemt), goddelijke tussenkomst
(Dionysus laat hem vergeten, als een soort straf/gunst omdat hij Ariadne voor de god "vrijmaakte"),
of gewone menselijke zorgeloosheid na het trauma van het labyrint. `CH4_T15` noemt alle drie in
één zin en kiest er geen.

**Voorstel:** laat de manier waarop de speler in `CH4_T09` (het moment op Naxos) reageerde de
verklaring in `CH4_T15` bepalen. Koos de speler `[CLEMENTIA]` ("zoek naar begrip voor Theseus"),
dan wordt het een god die hem het geheugen vertroebelt; koos hij `[SEVERITAS]`, dan wordt het
platte onachtzaamheid; `[NEUTRAL]` houdt de bestaande, opengelaten tekst.

- **Waar hij samenkomt:** onmiddellijk (zelfde scène, andere laatste alinea).
- **Flags:** geen nieuwe — hergebruikt de al bestaande `approach`-tag uit `CH4_T09`.
- **Kosten:** triviaal.

### 1.4 Hoofdstuk 2 — Waarom wordt Kallisto een berin?

**Traditie:** Ovidius (*Metamorfosen* 2) laat Juno het uit pure jaloezie doen; Hyginus en
sommige weergaven laten (een boze) Diana het doen als straf voor de geschonden kuisheidseed —
een moreel heel andere lezing (bestraffing door de eigen godin die ze diende, in plaats van
wraak van een buitenstaander). Het spel kiest nu voor Ovidius' versie zonder alternatief te
noemen.

**Voorstel:** een lichte tekstvariant, opnieuw gestuurd door de opgebouwde houding — niet omdat
dit een zware keuze verdient, maar omdat het gratis is zodra het mechanisme uit 1.1-1.3 bestaat.
Bij Severitas-overwicht: Diana's eigen orde eist het (haar eer is geschonden); bij Clementia: Hera
alleen, buiten Diana's wil om (het huidige, mildere beeld voor Diana).

- **Waar hij samenkomt:** onmiddellijk.
- **Kosten:** triviaal, zelfde mechaniek als 1.1-1.3.

---

## 2. Perspectiefwissels

### 2.1 Hoofdstuk 8/9 — Diomedes en Glaucus: het schoolvoorbeeld dat ontbreekt

Dit is de sterkste vondst van deze fase. Het referentiedocument
(`cross_narratieve_figuren.md`, Deel 5) noemt het zelf als "het schoolvoorbeeld van hoe een
relatie uit een eerdere generatie een gevecht in een latere ontwapent": in de Ilias (boek 6,
regel 119-236) staat Diomedes tegenover de Trojaanse bondgenoot Glaucus, klaar om te vechten —
tot ze ontdekken dat hun grootvaders ooit gastvrienden waren. In plaats van te vechten wisselen ze
wapenrusting. Deze scène staat compleet los van de rest van de plot, is dramatisch krachtig, en
ontbreekt volledig uit het spel, terwijl Diomedes al een relatiescore heeft (zie fase 1 §6) en de
Agamemnon-tak van Hoofdstuk 8 hem juist als "gevaarlijkste man op het slagveld" laat zien.

**Voorstel:** een korte, optionele scène in de Agamemnon-tak van Hoofdstuk 8 (bijvoorbeeld tussen
`CH8_AGA_004` en `CH8_AGA_005`): de speler ziet Diomedes tegenover een naamloze Trojaanse
bondgenoot staan, hoort het gesprek over hun grootvaders, en kan de wapenruil zelf even helpen
regelen (`[STAT:gratia:13]`) of gewoon toekijken. Dit is geen "vertakking" in de zin dat het de
plot splitst — Diomedes doodt Glaucus sowieso niet, dat is vast — maar het is een perspectiefwissel:
de speler ziet voor het enige moment in het spel een Trojaan die *geen* vijand is.

- **Waar hij samenkomt:** binnen dezelfde scène (optioneel, geen aparte tak nodig).
- **Flags:** `RELATION: diomedes=+1` (bovenop de bestaande bron), `CODEX: diomedes_glaucus`.
- **Kosten:** klein — één nieuwe scène, geen nieuwe puzzel nodig.
- **Bron:** Ilias 6.119-236.

### 2.2 Hoofdstuk 9 — Helena tussen twee kanten

**Traditie:** de Odyssee (4.274-289, Menelaus' eigen verhaal aan Telemachus) vertelt dat Helena
rond het houten paard liep en de stemmen van de verstopte Grieken se vrouwen nabootste, om te
testen wie zich zou verraden — een moment waarop haar loyaliteit oprecht onduidelijk is. Een
andere traditie laat haar juist een fakkelsignaal aan de terugkerende vloot geven. Beide ontbreken
volledig; het spel laat Helena in Hoofdstuk 9 alleen passief zijn (uitgehuwelijkt aan Deiphobus,
zwijgend bij Hectors klaagzang).

**Voorstel:** in de Trojaanse tak (`CH9_TRO_012`, het feest, of `CH9_TRO_013`, de poorten), een
korte scène waarin de speler Helena bij het paard ziet — ze buigt zich naar het hout, en de
tekst laat bewust in het midden of ze de Grieken probeert te ontmaskeren of juist te beschermen.
Geen mechanische vertakking nodig (de historische afloop staat vast), maar wel een perspectief dat
nu he­lemaal ontbreekt: Helena als iemand met een eigen, onleesbare agenda, niet als lijdend
voorwerp.

- **Waar hij samenkomt:** binnen dezelfde scène.
- **Flags:** `CODEX: helena_paard_stemmen` (optioneel, verrijkt haar latere Codex-persoon-entry).
- **Kosten:** klein.
- **Bron:** Odyssee 4.274-289.

### 2.3 Hoofdstuk 8 — Briseis krijgt geen enkele regel

Ze is de aanleiding van de hele ruzie en wordt in `CH8_EPI_005` teruggegeven "met rijke
geschenken", zonder dat ze ooit iets zegt of doet. Geen vertakking nodig — een enkele, korte
`DIALOGUE`-regel op het moment van teruggave zou al genoeg zijn om haar van lijdend voorwerp naar
personage te tillen. Lage prioriteit op deze rubric (geen mechanisch gevolg), maar genoemd omdat
"perspectiefwissel" letterlijk vraagt om precies dit soort gemiste stem.

- **Kosten:** triviaal (een paar zinnen in een bestaande scène).

---

## 3. Ongebruikte antagonisten en onbenutte NPC-doden

### 3.1 Minos — kon bondgenoot-achtig worden, blijft nu vlak

Minos is nooit puur kwaadaardig in de bronnen — zijn wraak in Hoofdstuk 4 komt voort uit verdriet
om zijn zoon Androgeos en later om het verraad van zijn eigen dochter. Het spel raakt dat al even
aan ("Minos' Wraak", `CH4_T11`) maar behandelt hem verder als functie, niet als personage met een
eigen kant. Geen vertakking nodig — één extra alinea waarin Minos, na Ariadnes verraad, zelf een
moment van twijfel toont (moet hij zijn eigen dochter ook straffen?) zou voldoende zijn.

- **Kosten:** triviaal.
- **Geen bronconflict** — dit is uitbreiding, geen alternatieve traditie.

### 3.2 Hippolyte — de "onbenutte NPC-dood" met een echt alternatief

**Huidige staat:** `CH3_H17` laat Hippolyte sterven als ongelukkig neveneffect van Juno's list
(de Amazones vallen per abuis Herakles' schip aan). Dat is de mildere van twee tradities.

**Alternatieve traditie:** Apollodorus (*Bibliotheca* 2.5.9) laat Heracles haar juist rechtstreeks
doden nadat ze weigert de gordel vrijwillig af te staan — een veel hardere, minder toevallige
dood. **Wat het spel anders zou moeten doen bij die tegenovergestelde afloop:** Herakles zou dan
zelf verantwoordelijkheid dragen in plaats van "slachtoffer van Juno's list" te zijn, wat op
gespannen voet staat met hoe het spel hem verder consequent als goedmoedige, gedreven-door-schuld
figuur portretteert (zie Hoofdstuk 2). **Ik stel voor de bestaande, mildere versie te houden** —
niet als vertakking, maar als bewust vastgelegde keuze — juist omdat een hardere Herakles het
personage dat de rest van het spel opbouwt, zou ondermijnen. Genoemd hier ter registratie, niet
als aanbevolen wijziging.

- **Bron:** Apollodorus, *Bibliotheca* 2.5.9 (hardere versie) vs. de gebruikelijke, mildere
  compilatietraditie (gebruikt in het spel).

### 3.3 Aeëtes — permanent vlak, geen alt-traditie beschikbaar

Geen brongebaseerd alternatief gevonden waarin Aeëtes bondgenoot wordt — hij blijft in vrijwel
elke versie vijandig tot en met de moord op zijn eigen zoon Apsyrtus (zie 4.1). Geen voorstel.

---

## 4. Onbenutte mislukkingen

### 4.1 De grootste: Apsyrtus ontbreekt volledig

Dit is geen "mislukking" in de zin van een gefaalde speler-actie, maar een van de donkerste en
bekendste beats van de hele Argonautentocht die het spel stilzwijgend overslaat: op de vlucht uit
Colchis doodt Medea haar eigen jongere broer Apsyrtus en verspreidt zijn lichaamsdelen om Aeëtes'
achtervolging te vertragen (Apollonius Rhodius, *Argonautica* 4.450-481; in Ovidius' en andere
tradities varieert de wreedheid van het detail, maar de moord zelf staat vrijwel overal). `CH5_028`
springt van "het Gulden Vlies veilig aan boord" direct naar "de terugreis duurt bijna net zo lang".

**Waarom dit ertoe doet voor deze rubric:** Medea's latere wraak in Korinthe (`CH5_029`) wordt nu
verteld als een plotselinge, bijna onverklaarbare wending — "geen enkel lied vertelt dat deel graag
in detail". Met Apsyrtus erbij zou de speler al in Hoofdstuk 5 zien waartoe Medea bereid is, en zou
`CH5_029` een echo zijn in plaats van een verrassing.

**Voorstel:** een korte, verplichte (geen keuze — dit is vaste mythe) scène tussen `CH5_027` en
`CH5_028`, waarin de speler getuige is zonder in te grijpen. Optioneel: een houdingskeuze
(`[CLEMENTIA]`/`[SEVERITAS]`/`[NEUTRAL]`) over hoe de speler hierop reageert, die — via het in
1.1-1.4 voorgestelde mechanisme — meetelt voor hoe Medea's latere Codex-entry wordt geschreven.

- **Waar hij samenkomt:** binnen twee scènes (geen echte splitsing, één verplichte scène).
- **Flags:** `CODEX: medea_apsyrtus` (dwingend, geen conditie), plus optioneel de houding-tag.
- **Kosten:** klein — één nieuwe scène, geen nieuwe puzzel.
- **Bron:** Apollonius Rhodius, *Argonautica* 4.450-481.

### 4.2 Puzzels en gevechten: het systemische antwoord

De opdracht vraagt hier specifiek naar plekken waar *het verhaal* doorgaat alsof de speler
slaagde, ondanks een fout. Zoals in fase 2 vastgesteld: dat geldt voor **elke** puzzel en **elk**
gevecht in het spel — er is geen enkele faalstaat. Dit is dus geen incident maar een systeemkeuze,
en hoort dan ook systemisch te worden opgelost, niet scène voor scène. Zie fase 9 (mechanismen) en
fase 11 (backlog) voor het concrete voorstel: geen harde game-over, maar een "ander verhaal"
zoals de opdracht zelf vraagt — bijvoorbeeld een extra, iets moeizamer bereikte versie van dezelfde
scène in plaats van een blokkade. `CH4_T06B` (het labyrint) is het enige bestaande precedent en
kan als sjabloon dienen.

---

## 5. Duur — vertakkingen die niet binnen twee scènes samenkomen

Geen van de bovenstaande voorstellen vraagt om een vertakking die pas na twee scènes weer
samenkomt: ik heb bewust gekozen voor tekstconditionele varianten (1.1-1.4), korte optionele
scènes (2.1-2.3, 4.1) en registratie-only bevindingen (3.1-3.3) boven een echte, dure
plotsplitsing. De enige bestaande dure vertakking in het spel is `CH9_005` (muren/strand, 21 vs.
22 scènes, komt nooit meer samen) — die bestaat al en wordt in fase 1/2 behandeld, niet hier
opnieuw voorgesteld.

Als je alsnog een grote, dure vertakking wilt overwegen: de meest voor de hand liggende kandidaat
is de lijkspelen voor Patroklos (fase 3, §2d) als een derde, aparte "welke wedstrijd volg je"-tak
binnen Hoofdstuk 8 — dat zou README-gewijs op `CH5_008` (Atalanta/Meleager) lijken, maar dan met
drie of vier takken in plaats van twee, en zou dus wél in de "duur"-categorie vallen. Ik noem het
hier als bewuste optie, niet als aanbeveling — de kosten/baten-verhouding is minder gunstig dan
de andere voorstellen in deze fase.
