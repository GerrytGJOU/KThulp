# Fase 8 — Twee talen, één klas

**Belangrijk om vooraf te melden**: dit onderwerp stond al op de radar vóór
deze audit — een eerdere ronde ("Reactiviteitsaudit", zie `audit/` in de
repo) signaleerde het (daar "fase 7 §6" genoemd) en er is inmiddels
daadwerkelijk een taalspoor-mechanisme gebouwd (`Chronica.md` §7.19, B24,
2026-07-29), zij het alleen vanaf Hoofdstuk 10. Deze fase beoordeelt wat er
staat, verifieert het tegen de huidige code, en beoordeelt specifiek wat dat
betekent voor Hoofdstuk 1-9 (van vóór dit mechanisme bestond).

**Correctie (na overleg met Gerben, 2026-07-29)**: het onderstaande beschreef
het ontbreken van taalspoor-filtering in H1-H9 aanvankelijk als een
eerlijkheidsprobleem/bug. Dat is onjuist — de onderbouw (H1-9) is bewust
tweetalig: leerlingen volgen op die leeftijd zowel Latijn als Grieks, en
pas in de bovenbouw (vanaf Hoofdstuk 10) wordt er een keuze gemaakt. Het spel
is precies zo ingericht, en "beide" blijft nadrukkelijk een geldige,
blijvende keuze voor leerlingen die met allebei doorgaan. Voorstel #1 uit
`10-voorstellen.md` (taalspoor-FLAG eerder zetten) is op basis hiervan
**ingetrokken** — de rest van deze fase (§1-3) blijft staan als beschrijving
van hoe het mechanisme werkt en welk gat (docentniveau-instelling) nog open
staat, maar zonder de eerdere "bug"-framing.

## 1. Is het spel nu speelbaar en eerlijk voor een eentalige leerling?

**Vanaf Hoofdstuk 10: ja, deels.** Geverifieerd in `certamen/singleplayer.js`
en `singleplayer-data.js`:
- `FLAG taalspoor=latijn/grieks/beide` wordt gezet in de gedeelde
  `CH10_000`-proloog.
- De hub (`CH10_001`) verbergt de Odysseus-knop bij `taalspoor=latijn` en de
  Aeneas-knop bij `taalspoor=grieks` (`[REQUIRE:taalspoor!=...]`).
- `spCombatNextQuestion()` filtert de Combat-bridge-vraagpool op
  `SP_VOCAB_ENTRIES[id].taal` zodra `taalspoor` "latijn" of "grieks" is
  (geverifieerd, regel 2006-2014 in `singleplayer.js`), met een fallback naar
  de ongefilterde pool als de gefilterde pool leeg zou zijn.

**Vóór Hoofdstuk 10 (H1-H9, dus 90%+ van de gebouwde inhoud): nee, niet
gefilterd — en dat raakt drie systemen tegelijk:**

1. **Narratieve blootstelling.** H3, H5, H7, H8 zijn Grieks-verteld; H2, H4,
   H6, H9 (Trojaanse kant) zijn Latijns-verteld — maar dit is puur een
   verteltraditie-keuze per hoofdstuk, geen speler-instelling. Een leerling
   die alleen Latijn volgt, krijgt in H3/H5/H7/H8 volledig Griekse
   leesvallen/gloss-fragmenten te zien (en omgekeerd voor een Grieks-only
   leerling in H2/H4/H6/H9-Trojaans). Voor Fase 7's bevinding (5 van de 13
   leesvallen zijn *echte* taal-leesvallen, niet mythe-gokbaar) betekent dit
   concreet: een Grieks-only leerling die LV-03 (CH4, Latijn) of LV-07 (CH6,
   Latijn) tegenkomt, kan die alleen nog gokken — hij heeft geen enkele kans
   om de taalkundige clue te gebruiken. Dat is precies het probleem dat Fase 7
   al signaleerde, nu verscherpt: voor de helft van de spelers is zelfs een
   "goed ontworpen" taal-leesval feitelijk een kansspel.
2. **Combat-bridge-vragen (bevestigd in de code).** `spCombatNextQuestion()`
   filtert alléén als `SP_STATE.flags.taalspoor` gezet is — en die FLAG wordt
   pas gezet in `CH10_000`. Voor elke speler die nog in H1-H9 zit (dus
   iedereen behalve wie al Hoofdstuk 10 heeft bereikt) is er **geen enkele
   taalfilter**: de vraagpool (`SP_STATE.vocab`, de al geleerde woorden) mengt
   Latijnse en Griekse entries door elkaar zodra een speler beide soorten
   `VOCAB:`-hooks is tegengekomen (wat structureel gebeurt, want de meeste
   hoofdstukken hebben meerdere lijnen met verschillende taal). Een
   Latijn-only leerling kan dus tijdens een Combat-bridge-gevecht een vraag
   krijgen over een Grieks woord dat hij nooit geacht wordt te kennen. Dit is
   geen theoretisch risico maar een direct gevolg van hoe de functie nu is
   geschreven (code zelf erkent dit met een commentaarregel: *"'beide' (of
   geen keuze, vóór Hoofdstuk 10) filtert niet — huidig gedrag"*).
3. **`SP_VOCAB_ENTRIES`/Codex Memoriae.** Dezelfde vermenging: de Codex
   Memoriae toont woorden uit beide talen door elkaar, ongeacht welk vak de
   leerling volgt.

## 2. Voorstel: instelbaar taalspoor, verhaal blijft identiek

Het B24-mechanisme (§1 hierboven) is precies het juiste patroon — het
voorstel hier is om het **eerder te laten ingaan en breder te laten werken**,
niet om iets nieuws te verzinnen:

- **Zet de taalspoor-vraag naar de allereerste keuze van het spel** (Proloog
  of `CH1_000`, vóór de drie-lijnen-keuze) in plaats van pas bij Hoofdstuk 10.
  Technisch identiek aan wat al bestaat (`FLAG taalspoor=...`), alleen
  eerder gezet.
- **Combat-bridge-filter geldt dan vanaf het begin** — geen codewijziging
  nodig in `spCombatNextQuestion()` zelf (die controleert toch al op de FLAG,
  ongeacht wanneer die gezet is), alleen de FLAG moet eerder bestaan.
- **Narratieve blootstelling (leesvallen/gloss) hoeft NIET aangepast te
  worden** — dit is bewust, en sluit aan bij B23's eigen argument (§7.16):
  een leerling die alleen Grieks doet, hoort via de Boodschapper toch passief
  Latijn, en omgekeerd. Puur **cross-track-blootstelling behouden voor de
  sfeerlaag en de niet-kern-leesvallen** (de 6 mythe-gokbare uit Fase 7, waar
  taalkennis toch niet doorslaggevend is), maar voor de **5 zuivere
  taal-leesvallen** (LV-03/04/05/07/13) is het eerlijker om te weten of de
  speler de taal van dat fragment ooit heeft gehad — niet om ze te verbergen
  (dat zou het spel ARM maken), maar om er evt. een extra keuze-optie aan toe
  te voegen specifiek voor "ik heb deze taal niet gehad" (zie §3).
- **Verhaal blijft voor 100% identiek** ongeacht taalspoor — dat is nu al zo
  (de `[REQUIRE:taalspoor!=...]`-tags verbergen alleen knoppen die naar
  DEZELFDE bestemmingsscènes leiden via de andere route; de inhoud van beide
  lijnen verschilt uiteraard qua taal maar niet qua verhaalstatus/eindpunt).

## 3. Niveau-instelling per klas

**Bestaat momenteel niet, en dat is al gedocumenteerd backlog** (`Chronica.md`
§12.1/§12.3-item-6: *"Opt-in hulpmiddelen + docentrapportage bestaan niet...
Geen docent-instelbaar niveauplafond — Chronica singleplayer heeft momenteel
geen enkel docentscherm"*, met Battle Mode's docent-ingestelde numerieke
drempels als bruikbaar precedent). Deze audit bevestigt dat dit gat er nog
is en voegt een concrete reden toe waaróm het nu urgenter is dan toen het
voor het eerst gesignaleerd werd: met de bevindingen van Fase 2 (dekking) en
Fase 5 (hints groeien i.p.v. krimpen) zou een docent-instelbaar niveau vooral
moeten sturen op **hoeveel hint-tekst standaard zichtbaar is** en **of
leesvallen een extra "ik ken deze taal niet"-vangnet krijgen** — niet op
verhaalinhoud (die blijft, terecht, voor iedereen gelijk). Zie Fase 9 voor
hoe dit zich verhoudt tot logging/docentrapportage, en Fase 10 voor
prioritering t.o.v. de andere bevindingen.
