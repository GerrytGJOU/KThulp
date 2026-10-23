/* ============================================================================
   CASTRA HEROUM — HANDLEIDING / FAQ (voor leerlingen)
   ----------------------------------------------------------------------------
   Bereikbaar op drie plekken: (1) Certamen-hoofdmenu → tegel "Handleiding" → keuze per spel (SCREENS.helpHub),
   (2) in het spel via het menu ☰ → Handleiding, (3) in het spel via de knop ? → "Volledige handleiding".
   De secties staan als data in CASTRA_FAQ; werk ze bij als de spelregels veranderen (zie CLAUDE.md).
   Laadt NA castra-menu.js en castra-stage.js.
   ============================================================================ */
let CASTRA_FAQ_FROM = "helpHub";
const CASTRA_FAQ = [
  { id:"start", t:"Wat is Castra Heroum?", open:true, b:`
    <p>Je bouwt een Romeins kamp, verzamelt soldaten en legendarische helden en trekt erop uit door Latium, Graecia, Troia en andere landen.
    Alle teksten zijn in <b>eenvoudig Latijn</b> met een Nederlandse vertaling: tik of klik op een woord voor de betekenis, op het ⓘ-teken voor de hele zin.
    Wie goed leest, weet wat er gevraagd wordt.</p>
    <p>Het spel bestaat uit vier delen: het <b>kamp</b> (gebouwen en grondstoffen), de <b>jacht</b> (vijanden verslaan en vangen), de <b>tower defence</b> (je kamp verdedigen) en <b>opdrachten</b> van mensen in de wereld.</p>` },
  { id:"bediening", t:"Lopen en bediening", b:`
    <ul><li><b>Telefoon of tablet:</b> sleep met je duim over de kaart (er verschijnt een joystick), of tik ergens om daarheen te lopen.</li>
    <li><b>Laptop:</b> pijltjestoetsen of W A S D. Tik of klik ergens om daarheen te lopen.</li>
    <li><b>Gebouwen:</b> tik op een gebouw om het te openen. Met het toetsenbord sta je ervoor en druk je op Enter of spatie. Er opent niets meer als je er alleen tegenaan loopt.</li>
    <li><b>Praten:</b> staat er iemand naast je, dan verschijnt rechtsonder de knop <b>💬 Praat</b> (of druk op Enter). Je kunt ook tegen de persoon aan lopen of erop tikken.</li>
    <li><b>Deuren:</b> staat er een deur naast je, dan verschijnt de knop <b>🚪 Binnen</b>. Je kunt ook op het huis tikken.</li>
    <li><b>Zones:</b> gestippelde vlakken met een naam (bos, weg, veld) zijn zones. Opdrachten tellen vijanden alleen in de juiste zone; het chipje bovenaan zegt waar je staat en waar je heen moet.</li>
    <li><b>Gesprek per ongeluk gestart?</b> Loop gewoon weg: het sluit vanzelf en je kunt later opnieuw beginnen.</li>
    <li><b>Menu ☰</b> (rechtsboven): je team, helden, voorraad, het Diarium met opdrachten, de Codex en deze handleiding.</li>
    <li><b>⛶ Full-screen:</b> verbergt de balk zodat de kaart het hele scherm vult. Linksboven staan dan knoppen om weer terug te gaan, voor uitleg (?) en om het spel te verlaten (‹).</li></ul>` },
  { id:"kamp", t:"Het kamp: gebouwen en grondstoffen", b:`
    <p>Je hebt vier grondstoffen: <b>frumentum</b> (graan), <b>lignum</b> (hout), <b>aes</b> (brons) en <b>gloria</b> (roem). Hout en brons groeien vanzelf in de Lignatio en het Metallum; tik op het gebouw om te verzamelen. De opslag is na een paar uur vol, maar er is geen straf als je later terugkomt.</p>
    <p>Met grondstoffen bouw en verbeter je gebouwen. Het <b>Praetorium</b> bepaalt hoe hoog de andere gebouwen mogen worden. Het <b>Contubernium</b> bepaalt hoeveel soldaten je kunt hebben, het <b>Heroum</b> hoeveel helden tegelijk mee mogen het gevecht in.</p>
    <p><b>Labor</b> (vanaf niveau 5): zet soldaten aan het werk in het Praetorium, de Lignatio of het Metallum. Een werkende soldaat levert extra grondstoffen op, maar doet niet mee aan gevechten tot je hem terugroept.</p>` },
  { id:"soldaten", t:"Soldaten: groeien en evolueren", b:`
    <p>Soldaten werf je in het kamp en krijg je door te jagen. Ze hebben een <b>vorm</b> met een tier (1 tot 4), een volk en een type: infanterie, afstand, ruiterij of ondersteuner. Door te vechten krijgen ze ervaring (XP) en gaan ze een <b>gradus</b> (level) omhoog; sommige vormen kunnen evolueren naar een sterkere vorm, soms met een keuze tussen twee wegen.</p>
    <p>Elke soldaat leert vanaf bepaalde levels <b>artes</b> (vaardigheden). Je kiest er maximaal vier. In de <b>Codex</b> zie je alle vormen die je al hebt ontmoet. Rustende soldaten krijgen ook een beetje XP via het Contubernium.</p>
    <p>Een gewonde soldaat kan niet vechten tot hij hersteld is (Valetudinarium, of betaal om meteen te genezen).</p>` },
  { id:"eenheden", t:"Eenheden vergeleken: wie is waar goed in?", b:`
    <p>Elke soldaat en held heeft een <b>soort</b> en (als hij artes leert) een <b>klasse</b>. Het soort bepaalt wat hij van nature kan; de klasse wat hij erbij leert.</p>
    <h4 style="margin:10px 0 4px">De soorten</h4>
    <div style="overflow-x:auto"><table style="border-collapse:collapse;font-size:14px;min-width:560px"><thead><tr style="text-align:left;border-bottom:2px solid var(--stone4,#6b5630)"><th style="padding:4px 8px">Soort</th><th style="padding:4px 8px">Sterk</th><th style="padding:4px 8px">Zwak</th><th style="padding:4px 8px">Bereik*</th></tr></thead><tbody>
      <tr style="border-top:1px solid var(--stone4,#6b5630)"><td style="padding:4px 8px"><b>🛡️ Infanterie</b></td><td style="padding:4px 8px">veel levenspunten en verdediging, stevig</td><td style="padding:4px 8px">kort bereik, weinig tempo</td><td style="padding:4px 8px">±1,6 tegels</td></tr>
      <tr style="border-top:1px solid var(--stone4,#6b5630)"><td style="padding:4px 8px"><b>🏹 Afstand</b></td><td style="padding:4px 8px">groot bereik, goede schade</td><td style="padding:4px 8px">weinig levenspunten en verdediging</td><td style="padding:4px 8px">±5 tegels (met artes tot ±7)</td></tr>
      <tr style="border-top:1px solid var(--stone4,#6b5630)"><td style="padding:4px 8px"><b>🐎 Ruiterij</b></td><td style="padding:4px 8px">de meeste schade en het hoogste tempo; extra sterk tegen verzwakte vijanden</td><td style="padding:4px 8px">kort bereik</td><td style="padding:4px 8px">±1,6 tegels</td></tr>
      <tr style="border-top:1px solid var(--stone4,#6b5630)"><td style="padding:4px 8px"><b>✨ Ondersteuning</b></td><td style="padding:4px 8px">maakt anderen sterker, geneest; commandanten en bouwers</td><td style="padding:4px 8px">zelf weinig schade</td><td style="padding:4px 8px">±3,4 tegels</td></tr>
      <tr style="border-top:1px solid var(--stone4,#6b5630)"><td style="padding:4px 8px"><b>🐉 Mythisch</b></td><td style="padding:4px 8px">gemengd: vlot, vertraagt vijanden, raakt meer vijanden tegelijk</td><td style="padding:4px 8px">niet de beste in één ding</td><td style="padding:4px 8px">gemiddeld</td></tr>
      <tr style="border-top:1px solid var(--stone4,#6b5630)"><td style="padding:4px 8px"><b>Rekruut</b></td><td style="padding:4px 8px">beginsoldaat, alles gemiddeld; evolueert naar een soort</td><td style="padding:4px 8px">nog zwak</td><td style="padding:4px 8px">kort</td></tr></tbody></table></div>
    <p class="note" style="margin-top:4px">* Bereik van een soldaat van tier 3 op gradus 10 in de tower defence; het groeit mee met zijn stats en zijn artes.</p>
    <h4 style="margin:12px 0 4px">Steen, papier, schaar</h4>
    <p><b>Infanterie</b> wint van <b>ruiterij</b>, <b>ruiterij</b> van <b>afstand</b> en <b>afstand</b> van <b>infanterie</b>. Heeft je eenheid voordeel, dan doet hij 50% meer schade; heeft hij nadeel, dan maar 75%. In de jacht zie je dat aan een ▲ of ▼ bij een move.</p>
    <h4 style="margin:12px 0 4px">Samenwerken in de tower defence</h4>
    <ul><li><b>Muri et sagittae:</b> staat een boogschutter binnen 3 tegels van infanterie, dan vertraagt de infanterie vijanden met 25%.</li>
    <li><b>Acies:</b> een boogschutter naast ondersteuning (binnen 1,5 tegels) krijgt 15% meer bereik.</li>
    <li><b>Steun:</b> torens binnen 1,5 tegels van ondersteuning doen 25% meer schade.</li>
    <li><b>Persecutio:</b> ruiterij doet 50% extra schade aan vijanden die al minder dan de helft van hun levenspunten hebben.</li></ul>
    <p>Een goede opstelling mengt de soorten: infanterie aan de bocht (vertraagt), boogschutters daarachter met bereik over de weg, ruiterij bij het einde van de weg om te vellen wat nog doorkomt, en ondersteuning in het midden.</p>
    <h4 style="margin:12px 0 4px">De klassen (artes)</h4>
    <p>Vanaf bepaalde levels leert een eenheid artes van zijn klasse; je kiest er vier. De schuine tekst achter elke klasse zegt waar ze het best in is.</p>
    <ul><li><b>Hopliet</b> (zware infanterie): vertraagt vijanden, geeft torens in de buurt extra schade, later +20% bereik en +1 leven voor het kamp na elke golf. <i>Verdediger en frontlijn.</i></li>
    <li><b>Spartaan</b> (voorvechter): veel extra schade, slagen negeren een deel van het pantser, de eerste treffers van elke golf doen driedubbele schade. <i>Pure schade op korte afstand.</i></li>
    <li><b>Boogschutter:</b> negeert de helft van het pantser, schiet sneller en dubbel, groter bereik en treft ook vijanden naast het doelwit. <i>Bereik en tempo.</i></li>
    <li><b>Cavalerie:</b> eerste treffers van een golf dubbele schade, veel tempo, negeert 40% pantser, elke vijfde treffer driedubbel. <i>Snelle uitvallen.</i></li>
    <li><b>Priester:</b> torens in de buurt en alle torens doen meer schade, genezing voor het kamp na elke golf, extra beloning. <i>Steun voor het hele team.</i></li>
    <li><b>Centurio</b> (commandant): grote en zeer grote kringen met extra schade voor je torens, alle torens +5%, extra beloning. <i>Aura en leiding.</i></li>
    <li><b>Genie</b> (bouwers, machines): +30% bereik, schoten die het pantser negeren, schade aan meerdere vijanden. <i>Het grootste bereik van allemaal.</i></li>
    <li><b>Verkenner:</b> extra bereik, vertraagt vijanden elke tweede treffer, extra beloning. <i>Vertragen en buit.</i></li>
    <li><b>Myth</b> (mythische wezens): vertraagt, treft meerdere vijanden, geneest het kamp, en alle torens een beetje sterker. <i>Veelzijdig.</i></li></ul>
    <h4 style="margin:12px 0 4px">Tier en level</h4>
    <p>Een soldaat van <b>tier 1 tot 4</b> heeft ongeveer 1, 1,6, 2,4 en 3,2 keer de basisstats van zijn soort. Elke <b>gradus</b> (level) geeft er 2,5% bij. <b>Helden</b> zijn nog sterker (ongeveer als een tier 4-soldaat vanaf level 1) en hebben een eigen vaardigheid; zie het kopje over helden.</p>` },
  { id:"helden", t:"Helden: zeldzaam en uniek", b:`
    <p>Helden zijn legendarische soldaten met een eigen verhaal en een eigen vaardigheid vanaf het begin. Ze zijn sterk, dus <b>moeilijk te krijgen</b>:</p>
    <ul><li>Een held verschijnt pas vanaf een bepaald <b>Castra-niveau</b> (Aeneas direct, anderen later) en nadat je zijn spoor hebt gevonden tijdens het jagen.</li>
    <li>Je doorloopt zijn keten: vijanden verslaan, een gevecht winnen en hem in het Latijn overtuigen. Daarna woont hij in je Heroum.</li>
    <li>Praat met je helden in het Heroum voor <b>fides</b> (vertrouwen): daarmee mag hij hoger levelen.</li>
    <li>Per gevecht doen maximaal 1 tot 3 helden mee, afhankelijk van het niveau van je Heroum. De rest van je legertje bestaat uit soldaten.</li>
    <li>Op <b>gradus 25</b> vraagt een held om een persoonlijke opdracht; daarna kies je één van twee (Ulixes: drie) specialisaties. Op <b>gradus 40</b> volgt een tweede opdracht en wordt hij een prestigevorm met een unieke arte.</li></ul>` },
  { id:"jacht", t:"Op jacht: vechten en vangen", b:`
    <p>Loop door het <b>hoge, donkere gras</b>: daar kun je vijanden ontmoeten. Het gevecht gaat in beurten. Kies een aanval (<b>moves</b>): <b>Oppugna</b> is gratis, de andere moves hebben beperkte punten (PP) en verschillen in kracht en nauwkeurigheid. <b>Defende</b> halveert de schade van de vijand deze beurt.</p>
    <p><b>Vangen:</b> een verzwakte vijand kun je vangen, maar je moet eerst een Latijnse vraag goed beantwoorden. De kans hangt af van zijn levenspunten, zijn tier en je level. Bazen kun je niet vangen.</p>
    <p>Na het gevecht krijg je XP en soms grondstoffen. Wie vlucht verliest niets, maar krijgt ook niets.</p>` },
  { id:"td", t:"Tower defence: je kamp verdedigen", b:`
    <p>Via de <b>Porta praetoria</b> kom je bij de campagnekaart met missies. In een missie lopen vijanden langs een weg naar je kamp. Je zet soldaten en helden als <b>torens</b> naast de weg. Ze schieten zelf op alles binnen hun <b>bereik</b>.</p>
    <ul><li><b>Scherm:</b> de kaart vult het scherm; je eenheden en knoppen staan onderin. Met <b>⛶ Full-screen</b> wordt de kaart nog groter (op een telefoon werkt het het best liggend).</li>
    <li><b>Plaatsen:</b> kies een eenheid onderin en tik op een lege plek. Een cirkel laat het bereik zien (groen = hier mag je staan).</li>
    <li><b>Verplaatsen:</b> tik op een eenheid om zijn bereik te zien. Tik dan op een lege plek om hem te verplaatsen, of nogmaals op hem om hem terug te nemen. Dit kan zolang er geen golf loopt.</li>
    <li><b>Golven:</b> start een golf als je klaar bent. Elke vijand die je kamp bereikt kost een leven. Win je de laatste golf, dan krijg je de beloning.</li>
    <li><b>Impete! en State!:</b> met energie geef je je torens tijdelijk meer schade of vertraag je alle vijanden.</li>
    <li><b>Samen sterk:</b> sommige combinaties (bijvoorbeeld een ondersteuner naast boogschutters) geven extra bonussen. Onderaan zie je welke actief zijn.</li></ul>` },
  { id:"opdrachten", t:"Opdrachten (❗ 💬 ❓)", b:`
    <p>Mensen in de wereld geven opdrachten. Je herkent ze aan een teken boven hun hoofd:</p>
    <ul><li><b>❗</b> iemand heeft een nieuwe opdracht voor je. <b>Hoe accepteer je die?</b> Loop naar die persoon (of tik op hem) en praat met hem: druk op <b>💬 Praat</b>. Hij vertelt wat hij nodig heeft, daarna kies je <b>Accipio</b> (aannemen) of <b>Nunc non</b> (nu niet).</li>
    <li><b>💬</b> hier moet je praten voor een stap van een lopende opdracht.</li>
    <li><b>❓</b> de opdracht is klaar: ga terug naar de gever voor je beloning.</li></ul>
    <p>Bewoners die rondlopen (boeren, soldaten, kinderen) hebben ook opdrachten; blijf even staan als ze bewegen. Je lopende opdrachten zie je bovenaan het scherm en in het <b>Diarium</b> (menu ☰). Opdrachten passen bij de persoon: een boer mist een dier, een soldaat vraagt om een gevecht.</p>` },
  { id:"veld", t:"Versperringen en veldacties", b:`
    <p>Elk land heeft <b>heggen</b> dwars over de kaart met één opening op de weg. Daar staat een <b>versperring</b> die je met de juiste klasse in je leger opruimt:</p>
    <ul><li>🪨 <b>Rots</b>: een hopliet of spartaan breekt hem.</li>
    <li>🪵 <b>Omgevallen boom</b>: een genie (bouwer) ruimt hem op.</li>
    <li>🗿 <b>Vervloekt altaar</b>: een priester of mythisch wezen reinigt het (en geneest je gewonde soldaten).</li>
    <li>⛺ <b>Verlaten legerplaats</b>: een centurio voert de soldaten aan.</li></ul>
    <p>Loop ertegenaan of tik erop: het spel vraagt of je wilt beginnen en kiest de beste eenheid. Heb je de klasse niet, dan kun je <b>arbeiders inhuren</b> voor grondstoffen, dus je komt nooit vast te zitten. Een opgeruimde versperring blijft weg.</p>
    <p>Daarnaast liggen er in elk land <b>veldacties</b> (rots, boom, altaar, legerplaats en 👣 sporen voor een verkenner of ruiter) die elke dag terugkomen en grondstoffen opleveren.</p>
    <p><b>Terugknop:</b> de knop ‹ linksboven gaat altijd naar het hoofdmenu van Certamen. Naar het kamp ga je met het menu ☰ → Castra (snelle reis).</p>` },
  { id:"latijn", t:"Latijn lezen", b:`
    <p>Tik op een onderstreept woord voor de Nederlandse betekenis, en op ⓘ voor de hele zin. Zo leer je vanzelf: de teksten gebruiken steeds dezelfde eenvoudige woorden en zinnen. Het spel houdt bij welke woorden je opzoekt; je docent ziet alleen een optelling per woord, geen namen.</p>
    <p>Je <b>metgezel</b> in het kamp stelt soms een korte vraag over een lastig woord. Goede antwoorden leveren beloningen op; je kunt altijd op "Later" tikken.</p>` },
  { id:"wereld", t:"Landen, poorten en het paard", b:`
    <p>Via de <b>Porta decumana</b> ga je naar de jacht, via de <b>Porta praetoria</b> naar de campagnekaart. Nieuwe landen (Graecia, Troia, Gallia, Aegyptus, Persis, Africa, Roma, Laconia, Germania, Themiscyra) openen als je missies wint. In elk land vind je eigen vijanden, grotten, huizen en bewoners.</p>
    <p><b>Dag en nacht:</b> het spel volgt de klok van je apparaat: <i>aurora</i> (dageraad), <i>dies</i> (dag), <i>vesper</i> (avond) en <i>nox</i> (nacht). 's Nachts verschijnen vaker mythische wezens en zijn wilde vijanden iets sterker; overdag verandert er niets. Rechtsboven in de balk zie je het moment van de dag.</p>
    <p>Met de opdracht <b>Equus perditus</b> verdien je een <b>paard</b>: met de knop 🐎 linksboven in de wereld rij je twee keer zo snel (binnen loop je altijd).</p>` },
  { id:"klas", t:"Legio, Colosseum en je klas", b:`
    <p><b>Legio</b> is een klassenevenement dat je docent start: de hele klas verdedigt samen één kamp, elke leerling zet zijn eenheden neer. <b>Colosseum</b> (vanaf niveau 20) is het spel tegen andere spelers: kies een duel of een vierkamp, zet in en win. Je klas en je docent zien de ranglijst per klas.</p>` },
  { id:"opslaan", t:"Opslaan, inloggen en problemen", b:`
    <p>Je voortgang wordt vanzelf opgeslagen op dit apparaat. Meld je aan via <b>Meedoen</b> met je klas- en leerlingcode om je voortgang ook online te bewaren en op een ander apparaat verder te spelen. Als gast blijft alles alleen op dit apparaat.</p>
    <ul><li><b>Het scherm scrolt of de joystick blijft hangen?</b> Ververs de pagina; je voortgang blijft bewaard.</li>
    <li><b>Ik zie een tekst niet?</b> Gebruik de knop ? voor uitleg of de Full-screen-knop voor meer ruimte.</li>
    <li><b>Een held komt niet in beeld?</b> Controleer je Castra-niveau (menu ☰ → je kaart) en jaag in het land van de held om zijn spoor te vinden.</li></ul>` },
];

function castraFaqHTML(){
  const sec = s=>`<details ${s.open?"open":""} style="margin-bottom:8px"><summary class="eyebrow l" style="cursor:pointer;list-style:revert;font-size:15px">${s.t}</summary><div class="panel" style="margin-top:6px;font-size:15px;line-height:1.5">${s.b}</div></details>`;
  return CASTRA_FAQ.map(sec).join("");
}
SCREENS.castraFAQ = function(){
  document.body.classList.remove("greek");
  H(brand(true)+`
  <div class="scrhead"><button class="back" onclick="castraFaqBack()">${iconSVG("shield",20,"currentColor")}</button><h2>📖 Handleiding Castra Heroum</h2></div>
  <div class="panel"><div class="note">Alles over het kamp, de jacht, de tower defence, helden en opdrachten. Tik op een kopje om het te openen.</div></div>
  ${castraFaqHTML()}
  ${foot()}`);
};
function castraFaqOpen(from){ CASTRA_FAQ_FROM = from || "helpHub"; try{ if(CASTRA_MENU && CASTRA_MENU.open) castraMenuClose(); }catch(_){} go("castraFAQ"); }
function castraFaqBack(){ go(CASTRA_FAQ_FROM==="game" ? "castraHome" : "helpHub"); }

// Hoofdmenu van de handleidingen: één plek voor alle spellen van Certamen.
SCREENS.helpHub = function(){
  document.body.classList.remove("greek");
  H(brand(true)+`
  <div class="scrhead"><button class="back" onclick="go('home')">${iconSVG("shield",20,"currentColor")}</button><h2>📖 Handleiding</h2></div>
  <div class="panel"><div class="note">Kies een spel voor uitleg en veelgestelde vragen.</div></div>
  <button class="tile" onclick="go('battleFAQ')"><span class="ic">${iconSVG("eagle",44,"currentColor")}</span><h3>⚔️ Battle Mode</h3><p>Klassen, combo's, helden en hoe een gevecht werkt.</p></button>
  <button class="tile" onclick="castraFaqOpen('helpHub')"><span class="ic">${iconSVG("tent",44,"currentColor")}</span><h3>🏕️ Castra Heroum</h3><p>Kamp, jacht, tower defence, helden en opdrachten.</p></button>
  <div class="panel"><div class="note">Voor Total War en Chronica Classica volgt een eigen handleiding.</div></div>
  ${foot()}`);
};

/* ---------- ingangen in het spel ---------- */
(function(){
  const i = CASTRA_MENU_ITEMS.findIndex(x=>x.id==="servare");
  CASTRA_MENU_ITEMS.splice(i<0 ? CASTRA_MENU_ITEMS.length : i, 0, { id:"faq", la:"Handleiding", nl:"uitleg en FAQ" });
})();
const _castraMenuViewFaq0 = castraMenuView;
castraMenuView = function(id){
  if(id==="faq") return `<h3 style="margin:0 0 6px">Handleiding <small>uitleg en FAQ</small></h3>
    <div style="font-size:14px;margin-bottom:8px">Hoe loop je, hoe accepteer je een opdracht, hoe werkt de tower defence? Alles staat in de handleiding.</div>
    <button class="btn btn-gold" style="min-height:44px" onclick="castraFaqOpen('game')">📖 Open de handleiding</button>`;
  return _castraMenuViewFaq0(id);
};
