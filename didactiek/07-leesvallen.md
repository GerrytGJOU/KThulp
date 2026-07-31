# Fase 7 — Leesvallen en gokgedrag

## 0. Correctie (2026-07-29) — een gemiste, ergere vorm van gokgedrag

Gerben merkte op dat de voorbeeldkeuzeteksten in `10-voorstellen.md` het
goede antwoord al verklapten via de framing zelf ("Begrijp de voorwaarde"
vs. "Versta het los van elkaar"). Bij het narekenen bleek dit **geen
incident in mijn voorbeeld, maar een bestaand patroon in 9 van de 13
leesvallen**: keuzeteksten die een kant expliciet als "zoals het bedoeld
is"/"goed" labelen en de andere als "verkeerd om"/"mis het woordje" —
woorden die correctheid verraden VOORDAT de speler de Latijnse/Griekse zin
zelf hoeft te ontleden. Dit is een zwaarder gokrisico dan het
mythekennis-gokrisico uit §1 hieronder (dat vereist tenminste dat de speler
iets wéét; dit vereist alleen dat hij "zoals bedoeld"/"correct"-achtige
taal herkent), en had in de oorspronkelijke Fase-7-analyse gesignaleerd
moeten worden — is dat niet.

**Gerepareerd** (dezelfde dag, in de live code): alle 9 herschreven naar
neutrale, parallelle framing ("Hoor er X in" / "Hoor er Y in" — géén van
beide gelabeld als correct), naar het voorbeeld van de al langer bestaande
neutrale leesvallen (`CH2_L02C`, `CH3_H23`, `CH4_T06B`). Betreft:
`CH5_022B`, `CH5_027_UITKIJK`, `CH6_003B`, `CH6_011B`, `CH7_003_EED`,
`CH7_005B`, `CH8_EPI_003`, `CH8_EPI_009`, `CH9_TRO_010`, `CH9_GRI_008B`.
`node --check` + `validate_chronica.js`: 0 fouten. Zie `Chronica.md` §7.28.

**Vast controlepunt voor élke toekomstige leesval**: geen van beide
keuzeopties mag een woord bevatten dat correctheid verraadt ("zoals
bedoeld", "goed", "correct", "verkeerd om", "mis het") — alleen neutrale,
symmetrische framing ("Hoor/Lees/Vat het op als X" tegenover hetzelfde voor
Y), zodat het enige onderscheid tussen de twee opties in de vertaling van de
brontekst zelf zit, niet in de metatekst eromheen.

## 1. Kan de speler doorkomen zonder een woord Latijn/Grieks te kennen?

Getoetst per leesval: zou iemand die geen woord Latijn/Grieks kent, maar wél
de directe verhaalcontext en/of de onderliggende mythe kent, de juiste keuze
kunnen raden? Dit splitst de 13 leesvallen in twee groepen — een onderscheid
dat de opdracht zelf niet expliciet maakt, maar dat wél nodig is om de
bevinding eerlijk te wegen.

### Groep A — echte taal-leesvallen (raden zonder taalkennis is moeilijk)

| ID | Waarom moeilijk te gokken |
|---|---|
| LV-03 (CH4_T06B, links/rechts) | Geen enkele Nederlandse paraphrase in de keuzetekst zelf verklapt de richting — de speler moet *sinistram* linken aan "links" (het Engelse cognaat "sinister" kan helpen, maar dat is transfer, geen gok). Vrijwel 50/50 zonder taalgevoel. |
| LV-04 (CH5_022B, wie vreest wie) | Beide interpretaties ("koning vreest vreemdeling" / "vreemdeling vreest koning") zijn narratief even plausibel — geen genre-conventie wijst één kant op. |
| LV-05 (CH5_027, "niet meer"/"nog steeds") | Achtervolgingscontext geeft geen voorkeur — een lezer kan evengoed verwachten dat de achtervolging doorgaat als dat die stopt. |
| LV-07 (CH6_011B, "nog niet"/"al aangekomen") | Oorlogscontext (Thebe) laat beide even aannemelijk. |
| LV-13 (CH9_GRI_008B, genitivus absolutus) | Vereist echt zien dat "νυκτὸς οὔσης" een tijdsbepaling is, geen bezitsvorm — niet af te leiden uit het verhaal alleen. |

### Groep B — mythe-leesvallen: raden zonder taalkennis is juist wél mogelijk

| ID | Hoe een speler dit kan raden zonder Latijn/Grieks |
|---|---|
| LV-06 (CH6_003B, Niobe deā potior est) | Wie de Niobe-mythe kent (hoogmoed tegenover Leto), weet dat "machtiger dan de godin" de kern van haar val is — dat hoeft niet uit het Latijn afgeleid te worden. |
| LV-08 (CH7_003_EED, Eed van Tyndareos) | De Eed is per definitie een eed om **wie onrecht is aangedaan** te helpen (de hele mythe draait om Helena's ontvoering) — narratief evident, ongeacht het Griekse deelwoord. |
| LV-09 (CH7_005B, Hecuba's droom) | Een droom die een ziener uitlegt, is in vrijwel elk mythologisch/verhalend genre een *voorspelling*, nooit een actuele beschrijving — het futurum is hier overbodig om te raden. |
| LV-10 (CH8_EPI_003, Thetis' waarschuwing) | Achilles' lot (sterven kort na Hector) is een van de bekendste mythologische feiten uit de hele Ilias — een speler die de mythe kent, hoeft de voorwaardelijke zin niet te ontleden. |
| LV-11 (CH8_EPI_009, μὴ ἔξελθε) | De scène zelf beschrijft al dat een wachter Priamus fysiek tegenhoudt en schreeuwt — het bevel-karakter is al verklapt vóór de Griekse tekst gelezen wordt. |
| LV-12 (CH9_TRO_010, Timeo Danaos) | Dit is de beroemdste Latijnse zin uit de hele westerse cultuur ("pas op voor Grieken die geschenken brengen") — cultuurkennis buiten het spel om volstaat volledig. |

**Resultaat: 6 van de 13 leesvallen (46%) zijn op te lossen met mythologie-
of cultuurkennis alleen, zonder enig woord Latijn of Grieks te hoeven
begrijpen.** Dit is geen ontwerpfout in de zin dat de foute opties willekeurig
zouden zijn (zie §2 — dat is niet het geval), maar het ondermijnt wel
gedeeltelijk het doel: deze zes leesvallen testen op dit moment vooral
mythekennis, niet taalbegrip. Dat is niet per se erg (mythekennis opbouwen is
ook een legitiem doel van het vak, en het spel doet dat al bewust via de
Codex/mythologie-entries) — maar het moet benoemd worden, want de opdracht
vraagt expliciet: zou een speler zonder taalkennis het via de omringende
tekst kunnen raden? Voor deze zes: ja, aantoonbaar.

## 2. Zijn de foute opties plausibele leerlingfouten?

**Ja, zonder uitzondering — dit is een sterk punt.** Elke "FOUT"-route
correspondeert met een gedocumenteerde, herkenbare grammaticale valkuil
(zie Fase 1/3 voor de volledige lijst): verborgen naamval, gemiste ontkenning
(3x), verborgen woordvolgorde, ablativus comparationis verward met een
gewone ablativus, passief vs. actief deelwoord, futurum vs. praesens,
voorwaardelijke zin vs. kale voorspelling, prohibitief vs. constatering,
deelwoordaanhechting, genitivus absolutus vs. bezitsvorm. Geen van de foute
opties is een willekeurige afleider — elke fout-route leert de speler iets
specifieks over hoe hij de zin verkeerd zou kunnen lezen. Dit voldoet volledig
aan het criterium uit de opdracht ("willekeurige afleiders leren niets") en
is, samen met de sprekerconsistentie (Fase 6), een van de meest zorgvuldig
uitgevoerde onderdelen van het hele systeem.

## 3. Nieuwe leesvallen — waar kan nu te makkelijk gegokt worden?

Twee soorten voorstellen: (a) de zes mythe-gokbare leesvallen scherper maken
zonder ze te herschrijven, en (b) nieuwe plekken die momenteel geen enkele
taaltoets hebben terwijl de scène zich er wel voor leent.

**(a) Bestaande leesvallen verstevigen (kleine ingreep, geen nieuwe scènes):**
- **LV-10 (Thetis)** en **LV-12 (Laocoön)**: voeg een derde, subtiel
  aannemelijke keuze toe die de mythe-kennis juist tegen de speler gebruikt
  (bv. bij Laocoön een optie die de bekende idioom-vertaling ietwat verdraait
  — "ik wantrouw zowel de Grieken als hun geschenk, maar het paard zelf is
  onschuldig" — een fout die precies iemand zou maken die de beroemde zin uit
  het hoofd kent maar "et" verkeerd koppelt). Dit voorkomt dat culturele
  voorkennis alleen al genoeg is.
- **LV-08 (Eed)** en **LV-09 (Hecuba)**: geen ingreep nodig — de mythe-conventie
  wijst hier toevallig naar de *correcte* lezing, dus het gokrisico werkt
  hier niet averechts (een gokkende speler komt toevallig goed uit, wat
  onschuldig is; het is anders bij LV-06/LV-10/LV-12 waar mythekennis een
  buitenproportioneel voordeel geeft t.o.v. taalkennis).

**(b) Nieuwe leesval-kandidaten (plekken die nu makkelijk te gokken taalmomenten missen, terwijl ze zich er wel voor lenen):**
- **Hoofdstuk 1** (Prometheus/Pandora/Midas): momenteel bewust 0 leesvallen
  (te vroeg, `Chronica.md` §7.23). Blijft terecht zo — geen voorstel hier.
- **Hoofdstuk 8, Aiax-lijn** (`SP_CH8_CNS` heeft een aparte Aiax-route naast
  Achilles): geen leesval toegewezen aan die lijn, terwijl H8 al twee andere
  leesvallen heeft (beide Achilles-lijn) — een leesval op de Aiax-route zou
  de aandacht eerlijker verdelen tussen de twee zijlijnen van dat hoofdstuk.
- **Hoofdstuk 10 (skelet, Odysseus/Aeneas)**: zodra dit hoofdstuk verder
  gebouwd wordt, is dit een goede plek voor de eerste taalspoor-afhankelijke
  leesval — één op de Odysseus-route (Grieks) en één op de Aeneas-route
  (Latijn), zodat het bestaande taalspoor-mechanisme (Fase 8) er meteen
  gebruik van maakt.

## 4. Samenvattend

De leesval-mechaniek zelf is solide: nooit willekeurige afleiders, altijd
reconvergerend, altijd een echte grammaticale valkuil. Het zwakke punt zit
niet in het mechanisme maar in de **keuze van momenten**: bijna de helft
raakt zwaar mythologisch beladen scènes waar cultuurkennis het taalbegrip
overbodig maakt. Voor toekomstige leesvallen (H10+): kies bij voorkeur
momenten waar de mythologische uitkomst zelf geen sterke voorkeur geeft aan
een van beide interpretaties (zoals LV-03/04/05/07/13 — de sterkste vijf).
