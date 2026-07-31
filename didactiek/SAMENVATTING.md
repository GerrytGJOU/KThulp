# Chronica Classica — didactische audit: samenvatting

Volledige onderbouwing: [`00-kader.md`](00-kader.md) t/m
[`10-voorstellen.md`](10-voorstellen.md). Alle cijfers zijn gemeten uit de
huidige code (`certamen/singleplayer-data.js`, `certamen/vocab.js`), niet
geschat, tenzij expliciet als schatting gemarkeerd.

## Staat het spel er didactisch goed voor?

**Gemengd, met een duidelijk patroon.** Chronica Classica heeft een aantal
mechanismen die zorgvuldig en volgens de theorie zijn gebouwd: de 13
leesvallen (nooit willekeurige afleiders, altijd echte grammaticale
valkuilen, nooit een strafscherm), de sprekerconsistentie (Grieks/Latijn
per verteltraditie, geen enkele inconsistentie gevonden over 10 hoofdstukken
heen), en de functionaliteit van elke Latijnse/Griekse zin (nergens een
"oefening in vermomming"). Dit zijn geen kleine dingen — ze zijn precies
waar veel taalonderwijsmateriaal faalt.

Maar op de vraag die het meest bepalend is voor *aantoonbare leerwinst* —
herhaling — scoort het spel zwak op één specifieke laag: **99% van de
woorden in de leesvallen en de passieve gloss-laag (de doorlopende
verhaaltekst) komt precies één keer voor.** Dit geldt nadrukkelijk niet voor
het hele spel: het Combat-bridge-gevecht trekt willekeurig uit de volledige,
opgebouwde lijst van geleerde `VOCAB:`-woorden (`SP_STATE.vocab`, alle
hoofdstukken samen) — een woord uit Hoofdstuk 1 blijft dus de rest van het
spel in elk gevecht terugkomen. Dat is echte, natuurlijk gespreide
herhaling, en die werkt al goed voor de 93 curriculum-woorden. Het probleem
zit dus niet in "geen herhaling in het spel", maar in **twee gescheiden
woordenpools**: de 93 `SP_VOCAB_ENTRIES`-woorden herhalen goed (via Combat),
de ~86 woorden uit leesvallen/passieve laag herhalen vrijwel nooit (die
komen nooit in Combat terecht, want ze krijgen geen `VOCAB:`-hook).

## De drie grootste tekortkomingen

1. **De doorlopende-verhaaltekst-laag (leesvallen + passieve gloss)
   herhaalt vrijwel niets.** 85 van de 86 unieke woorden in die laag komen
   precies één keer voor in het hele gebouwde spel (Proloog–Hoofdstuk 10).
   Dit is een aparte woordenpool van de 93 curriculum-woorden die via
   Combat-bridge wél goed herhalen (zie hierboven) — de twee systemen delen
   bijna geen materiaal. (Fase 1 §2, Fase 2 §3-4)
2. **De expliciete woordenschatgroei (`SP_VOCAB_ENTRIES`) is stilgevallen.**
   Groeide gestaag in Hoofdstuk 1-6 (en profiteert daarna aantoonbaar van
   Combat-herhaling), en stopt daarna volledig — niet omdat het principe niet
   werkt, maar omdat het simpelweg niet is voortgezet. Dit is de goedkoopst
   te repareren van de tekortkomingen, want het hergebruikt een al bewezen
   mechanisme. (Fase 2 §4, Fase 3, Fase 5 §4)
3. **Geen structurele overdracht tussen actief getoetste grammatica en de
   verhaaltekst** (Fase 3 §3/§5) — een net geleerde constructie komt vrijwel
   nooit nog een keer voor in een NPC-zin of leesval. Dit is een apart gat
   van de woordenschat-herhaling (punt 1) en betreft grammaticale vormen,
   niet losse woorden.

*(Eerder genoemd als derde tekortkoming: het ontbreken van een
taalspoor-filter vóór Hoofdstuk 10. Na overleg met Gerben blijkt dit geen
tekortkoming maar bewust ontwerp — de onderbouw is bewust tweetalig, zie de
correctie in `08-taalspoor.md`.)*

## Wat levert de meeste leerwinst per bestede uur op?

**Laat `VOCAB:`-hooks weer doorgroeien vanaf Hoofdstuk 7** — het hergebruikt
een al bewezen werkend mechanisme uit Hoofdstuk 1-6 (inclusief de
Combat-herhaling die daarmee automatisch meegroeit), geen nieuw systeem
nodig. (Voorstel #2, impact 5 / werk 2 — de gunstigste verhouding van de
resterende lijst.) Dit is dan ook het eerstvolgende voorstel om op te
pakken.

Volledige prioriteitslijst met alle 12 voorstellen en drie uitgewerkte
voorbeeldscènes: [`10-voorstellen.md`](10-voorstellen.md).
