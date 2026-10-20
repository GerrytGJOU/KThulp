# Castra Heroum — Colosseum (PvP) · ontwerpvoorstel

Status: **ontwerp, nog niet gebouwd** (2026-11-29). Hoort bij `CASTRA_HEROUM.md` en `CASTRA_TROEPENBOMEN.md`.

## 1. Wat Gerben wil

Een Colosseum (in Roma, bij de arena) met PvP in de stijl van de screenshot: twee spelers verdedigen elk hun eigen baan tegen steeds sterkere vijanden; wie het langst overleeft wint de inzet.
- **Duel (2 spelers):** ieder betaalt 100, de winnaar krijgt 200.
- **Vierkamp (4 spelers):** ieder betaalt 100, 1e krijgt 250, 2e 100, 3e 50, 4e niets (totaal 400 = 4 × 100: de pot blijft in evenwicht).
- Als synchroon spelen via Firebase te moeilijk is: mag ook niet-synchroon, met de uitslag achteraf.

## 2. Aanbeveling: gelijktijdig starten, apart spelen, uitslag door naspelen

Elke speler verdedigt een **eigen** baan; spelers beïnvloeden elkaar niet (zoals in de screenshot, waar alleen de vijanden steeds sterker worden). Daarom hoeft er **niets** live gesynchroniseerd te worden behalve het startmoment. Dat is veel eenvoudiger dan de Legio (waar iedereen op één kaart speelt):

1. **Zaad:** alle spelers krijgen dezelfde kaart, hetzelfde zaad en dezelfde eindeloze golvenreeks (golf n wordt sterker, deterministisch gegenereerd uit het zaad). Het bestaande simulatiemodel (`castraPSim`, vaste tick, gehele getallen, geseed RNG) is hier al voor geschikt.
2. **Eigen run:** je speelt je run lokaal, dus zonder netwerkvertraging. Je plaatsingen (tick, vak, soldaat) worden onderweg bewaard.
3. **Uitslag:** aan het eind (of bij je dood) zet je je actielijst en je resultaat (golf en tick van je dood, resterende levens, kills) in Firebase. **Iedere speler kan de run van een ander naspelen** (deterministisch, zoals de Legio-herberekening) en zo de uitslag zelf narekenen, zonder vertrouwen op een server.
4. **Rangorde:** langst overleefd (tick van je dood) > meeste kills > eerder ingediend. Wie niet indient vóór de deadline, krijgt niets (zijn inzet is dan al betaald).
5. **Uitbetaling:** geen server die geld verdeelt: iedere client schrijft zijn eigen winst eenmalig bij zichzelf bij (een `claimed`-vlag in de matchrecord voorkomt dubbel uitkeren). De inzet wordt bij het inschrijven afgeschreven; de som van uitbetalingen is gelijk aan de som van inzetten.
6. **Live kijken (optioneel):** elke golf schrijft je speler zijn golfnummer en levens naar `castraColosseum/{klas}/{match}/live/{lid}`; zo ziet iedereen de voortgang van de ander (zoals de balken in de screenshot) zonder dat iets synchroon moet lopen.

Dit is dus bijna volledig niet-synchroon, maar voelt gelijktijdig doordat iedereen op dezelfde tijd start (afteltimer via `serverTimeOffset`, zoals in de Legio) en elkaars voortgang ziet.

## 3. Eerlijkheid (het lastigste deel)

- **Gelijke krachten:** zonder normalisatie wint altijd de sterkste account. Voorstel: **divisies met een levelplafond** (bijvoorbeeld 20, 35, 50: alle soldaten en helden spelen op maximaal dat level) en **geen kaartbonussen** (`Tabulae`) in het Colosseum. Artes blijven gewoon: dan telt je keuze en opstelling.
- **Inzending controleren:** de simulatie neemt de statistieken van een toren uit de actie (in de Legio: veld `st`). Een valsspeler kan daar hogere waarden insturen. Verdediging: bij het naspelen de waarden begrenzen op wat het levelplafond toestaat (stats = formule van type, tier en level), en de actie verwerpen als ze daarbuiten vallen. Volledig sluitend is dit zonder server niet; voor een klas is dit voldoende (docent kan runs inzien).
- **Gelijkspel:** zie rangorde hierboven; daarna deelt de eerder ingediende inzending.
- **Wegvallen:** wie halverwege wegvalt, heeft zijn inzet betaald en wordt gerangschikt op de tick waarop hij stopte. Een lobby die niet vol komt, wordt geannuleerd (inzetten terug).

## 4. Gegevensmodel (voorstel)

`castraColosseum/{klas}/{matchId}`: `{ mode:"duel"|"quad", fee:100, divisie:35, seed, status:"lobby"|"running"|"done", startAt, createdBy, players:{ {lid}:{ nm, ts } }, live:{ {lid}:{ wave, lives } }, runs:{ {lid}:{ actions:[…], res:{ tick, wave, lives, kills } } }, paid:{ {lid}:true } }`.
Rules (nieuw blok, volgens de afspraken in CLAUDE.md eerst het volledige regelsbestand tonen en pas na akkoord publiceren): spelers mogen alleen hun eigen `players/{lid}`, `live/{lid}`, `runs/{lid}` en `paid/{lid}` schrijven; `runs` is na eerste schrijven vergrendeld (`!data.exists()`); leesbaar voor de klas (zelfde afweging als de Legio).

## 5. Spelverloop en plek

- **Plek:** in Roma, bij de arena: een deur *Colosseum* (nieuwe binnenruimte, zie `CASTRA_TROEPENBOMEN.md` §18). Binnen: een lobbybord (duel of vierkamp starten of meedoen, divisie en inzet zichtbaar) en je eigen rangschikking.
- **Run:** eigen baan (de bestaande tower defence-kaarten a/b), eindeloze golven: aantal en tier groeien per golf, met af en toe een baas en een mythisch wezen; levens 10 zoals nu; snelheid 1–3× en de gunsten uit de tower defence blijven uit (eerlijk voor iedereen), artes zijn toegestaan.
- **Beloning naast de inzet:** een klein vast bedrag roem en een kaarttrekking voor de winnaar, plus een prestatie in het Certamen-profiel (*Colosseum: winnaar*).
- **Ontgrendeling:** Castra-niveau 20 (een late ontgrendeling, past bij de rest van het niveausysteem).

## 6. Mogelijke uitbreiding (later): aanvalsmodus zoals op de screenshot

Op de screenshot kun je ook eenheden naar de tegenstander sturen (rechts de knoppen). Dat maakt spelers afhankelijk van elkaar en vraagt echte synchronisatie (lockstep op een gedeelde simulatie, zoals de Legio, maar dan met twee banen). Dat is haalbaar op de bestaande Legio-techniek, maar duurder om te bouwen en te testen. Aanbeveling: eerst de race-variant (hierboven) bouwen; de aanvalsmodus kan daarna als apart speltype.

## 7. Bouwplan (mijlpalen, elk met akkoord)

1. **C1 Eindeloze modus (solo):** golfgenerator uit een zaad, divisie-normalisatie (levelplafond), eindscherm met je record. Geen Firebase; testbaar op één apparaat. Hiermee valt de balans van "steeds sterkere vijanden" al te testen.
2. **C2 Duel via Firebase:** lobby, startaftelling, run-opslag, naspelen en uitbetalen (2 spelers), met nieuwe rules.
3. **C3 Vierkamp en live-balken:** 4 spelers, uitbetaling 250 / 100 / 50, voortgang van de ander zichtbaar.
4. **C4 Colosseum-binnenruimte in Roma** met lobbybord, prestatie en ranglijst per klas.
