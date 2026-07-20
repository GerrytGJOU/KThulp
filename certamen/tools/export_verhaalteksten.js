// Genereert Chronica_Verhaalteksten.txt (repo root) uit
// certamen/singleplayer-data.js: per hoofdstuk een stroomschema (scènes +
// keuzes als ingesprongen boomstructuur) gevolgd door de volledige ruwe
// verhaaltekst. Zie Chronica.md §10 voor de vaste regel: dit script
// opnieuw draaien na elke wijziging aan verhaaltekst.
// Aanroep: node certamen/tools/export_verhaalteksten.js  (vanaf repo-root of
// vanaf certamen/tools zelf — paden zijn relatief aan dit scriptbestand).
const fs = require("fs");
const path = require("path");
const repoRoot = path.join(__dirname, "..", "..");
const dataPath = path.join(repoRoot, "certamen", "singleplayer-data.js");
const src = fs.readFileSync(dataPath, "utf8");

function extract(name){
  const marker = "const " + name + " = `";
  const start = src.indexOf(marker) + marker.length;
  // Elk CNS-blok sluit af met "`.trim();" (nooit een kale "`;") — zoek daarom
  // specifiek naar dat sluitpatroon. Een kale "`;"-zoekopdracht overschiet
  // stilzwijgend tot het volgende hoofdstuk (of verder), want die twee tekens
  // komen nergens los na elkaar voor: dit gaf tot Hoofdstuk 4 toe een export
  // waarin elk hoofdstuk vanaf CH2 de rest van het bestand meesleepte.
  const end = src.indexOf("`.trim();", start);
  return src.slice(start, end).trim();
}

const APPROACH_TAG_RE = /\s*\[(CLEMENTIA|SEVERITAS|NEUTRAL)\]\s*$/i;
const REQUIRE_TAG_RE = /\s*\[REQUIRE:(\w+)=(\d+)\]\s*$/i;
const DONE_TAG_RE = /\s*\[DONE:(\w+)\]\s*$/i;

function parseScenes(cns){
  const scenes = new Map();
  const headerRe = /===\s*SCENE:\s*(\S+)\s*===/g;
  const matches = [...cns.matchAll(headerRe)];
  for(let i=0;i<matches.length;i++){
    const id = matches[i][1];
    const blockStart = matches[i].index + matches[i][0].length;
    const blockEnd = (i+1<matches.length) ? matches[i+1].index : cns.length;
    const block = cns.slice(blockStart, blockEnd);
    const endIdx = block.search(/^\s*END\s*$/m);
    const content = endIdx>=0 ? block.slice(0,endIdx) : block;
    const lines = content.split(/\r?\n/);
    let title = "", choices = [], inChoices = false, inTitle = false, titleBuf = [];
    const KNOWN = ["TITLE","TEXT","DIALOGUE","CHOICES","IMAGE","MUSIC","SFX","CODEX","QUEST",
      "COMBAT","REWARD","INVENTORY","PUZZLE","EERETITEL","FLAG","PERSON","VOCAB","FRAGMENT"];
    const sectionRe = new RegExp("^(" + KNOWN.join("|") + "):\\s*$");
    let cur = null;
    for(const line of lines){
      const m = line.match(sectionRe);
      if(m){
        if(cur==="TITLE") title = titleBuf.join(" ").trim();
        cur = m[1]; titleBuf = []; inChoices = (cur==="CHOICES");
        continue;
      }
      if(cur==="TITLE") titleBuf.push(line);
      if(inChoices && line.trim().startsWith("*")){
        const withoutBullet = line.trim().replace(/^\*\s*/, "");
        const arrowIndex = withoutBullet.lastIndexOf("->");
        if(arrowIndex!==-1){
          let label = withoutBullet.slice(0,arrowIndex).trim();
          const target = withoutBullet.slice(arrowIndex+2).trim();
          let tag = "";
          const reqM = label.match(REQUIRE_TAG_RE);
          if(reqM){ tag = ` [REQUIRE:${reqM[1]}=${reqM[2]}]`; label = label.slice(0,reqM.index).trim(); }
          const doneM = label.match(DONE_TAG_RE);
          if(doneM){ tag += ` [DONE:${doneM[1]}]`; label = label.slice(0,doneM.index).trim(); }
          const appM = label.match(APPROACH_TAG_RE);
          if(appM){ tag += ` [${appM[1].toUpperCase()}]`; label = label.slice(0,appM.index).trim(); }
          choices.push({ label, target, tag });
        }
      }
    }
    if(cur==="TITLE") title = titleBuf.join(" ").trim();
    scenes.set(id, { id, title, choices });
  }
  return scenes;
}

function chapterPrefix(id){
  const m = id.match(/^([A-Z]+\d*)_/);
  return m ? m[1] : id;
}

// Renderer: volgt een rechte lijn van enkelvoudige-keuze-scènes op DEZELFDE
// inspringing (geen trap van 15 niveaus voor een lange, lineaire lijn) en
// springt alleen in bij een echt vertakkingspunt (2+ keuzes). Stopt met
// verder uitklappen bij (a) een scène die al eerder in de boom voorkwam
// (convergentie) of (b) een scène uit een ANDER hoofdstuk (grenst het
// stroomschema netjes af per hoofdstuk, want CH1_EINDE -> CH2_000 zou anders
// heel Hoofdstuk 2 binnen Hoofdstuk 1's schema meetrekken).
function renderOutline(scenes, rootId){
  const rootPrefix = chapterPrefix(rootId);
  const visited = new Set();
  function renderChain(id, indent){
    const out = [];
    let curId = id;
    for(;;){
      if(visited.has(curId)){ out.push(indent + "→ " + curId + "  (zie hierboven)"); return out; }
      if(chapterPrefix(curId) !== rootPrefix){ out.push(indent + "→ " + curId + "  (volgend hoofdstuk)"); return out; }
      const scene = scenes.get(curId);
      if(!scene){ out.push(indent + "→ [ONBEKENDE SCENE: " + curId + "]"); return out; }
      visited.add(curId);
      out.push(indent + curId + " — " + (scene.title||""));
      if(scene.choices.length===0){ out.push(indent + "  (einde — geen vervolgkeuze)"); return out; }
      if(scene.choices.length===1){
        const c = scene.choices[0];
        out.push(indent + "  * " + c.label + c.tag);
        curId = c.target;
        continue;
      }
      scene.choices.forEach(c=>{
        out.push(indent + "  * " + c.label + c.tag);
        out.push(...renderChain(c.target, indent + "    "));
      });
      return out;
    }
  }
  return renderChain(rootId, "").join("\n");
}

const header = `CHRONICA CLASSICA — VERHAALTEKSTEN (werkkopie voor de auteur)
================================================================
Dit bestand is automatisch gegenereerd uit certamen/singleplayer-data.js.
Het is een WERKKOPIE, geen bron van waarheid — na het bewerken stuur je
(een deel van) dit bestand terug, en verwerk ik de wijzigingen in de echte
game-data.

VASTE REGEL (zie Chronica.md §10): dit bestand wordt vanaf nu bij elke
wijziging aan verhaaltekst opnieuw gegenereerd en meegecommit, zodat je
altijd een actueel overzicht hebt.

WAT MAG JE AANPASSEN
---------------------
- Alle tekst na TITLE:, TEXT: en DIALOGUE: (de verhalende proza-tekst).
- De leesbare tekst van een keuze in CHOICES:, dus alles VOOR de "->" pijl.
  Bijvoorbeeld in "* Ga de stad in -> CH1_A02" mag je "Ga de stad in"
  vrij herschrijven.

WAT MOET JE MET RUST LATEN (anders breekt de doorverwijzing)
--------------------------------------------------------------
- De scene-koppen, bv. "=== SCENE: CH1_A02 ===" - dit is de technische ID.
- Het stuk NA de "->" pijl in een keuze (bv. "-> CH1_A02") en eventuele
  tags erachter tussen [vierkante haken], zoals [CLEMENTIA]/[SEVERITAS]/
  [NEUTRAL]/[REQUIRE:fragments=4]/[DONE:ch2_lijn_latona] - deze zijn
  onzichtbaar voor de speler maar sturen de game-logica aan.
- Alle regels met een ANDER label dan TITLE/TEXT/DIALOGUE/CHOICES (dus
  PUZZLE:/CODEX:/PERSON:/VOCAB:/FLAG:/EERETITEL:/QUEST:/FRAGMENT:/IMAGE:/
  MUSIC:/COMBAT: en de tekst die daarna volgt) - dit zijn technische
  instellingen, geen verhaaltekst. Als je een woordkeuze in een puzzelvraag
  of -antwoord wilt aanpassen, kan dat wel, maar meld dat er apart bij, want
  die staan in een ander deel van het bestand (SP_PUZZLES), niet hieronder.

STROOMSCHEMA'S — hoe te lezen
------------------------------
Elk hoofdstuk begint met een ingesprongen boomstructuur: scène-ID + titel,
daaronder de keuzes die uit die scène leiden (label + eventuele onzichtbare
tag + doel-scène). "(zie hierboven)" betekent dat die scène al eerder in de
boom voorkwam — dat is een vertakking die weer samenkomt (convergentie),
geen fout.

WERKWIJZE
---------
1. Bewerk dit bestand (of een kopie ervan) in een gewone teksteditor.
2. Stuur het aangepaste bestand (of gewoon de aangepaste alinea's, met
   vermelding van welke scene het betreft) terug.
3. Ik verwerk de wijzigingen in singleplayer-data.js en commit/pusht ze.

================================================================

`;

// Ontdekt automatisch elke "const SP_..._CNS = `"-declaratie in
// singleplayer-data.js — geen handmatige lijst om bij te werken zodra een
// nieuw hoofdstuk (SP_CH3_CNS, enz.) erbij komt. Titel komt uit de TITLE:
// van de eerste scène in dat blok (de hub-scène), root-scène = eerste
// scène-ID in het blok.
const chapters = [];
const cnsConstRe = /const (SP_(\w+)_CNS) = `/g;
let cm;
while((cm = cnsConstRe.exec(src))){
  const constName = cm[1], key = cm[2];
  const cns = extract(constName);
  const firstIdMatch = cns.match(/===\s*SCENE:\s*(\S+)\s*===/);
  const root = firstIdMatch ? firstIdMatch[1] : null;
  const scenes = root ? parseScenes(cns) : null;
  const hubTitle = (scenes && scenes.get(root)) ? scenes.get(root).title : "";
  const label = (key==="PROLOOG" ? "PROLOOG" : "HOOFDSTUK " + (key.match(/^CH(\d+)$/)?.[1] || key))
    + (hubTitle ? " - " + hubTitle : "");
  chapters.push({ label, constName, root });
}

const body = chapters.map(ch => {
  const cns = extract(ch.constName);
  const scenes = parseScenes(cns);
  const outline = renderOutline(scenes, ch.root);
  return "\n\n################################################################\n" +
    "# " + ch.label + "\n" +
    "################################################################\n\n" +
    "-- STROOMSCHEMA --\n\n" + outline + "\n\n" +
    "-- VOLLEDIGE TEKST --\n\n" + cns;
}).join("\n");

const outPath = path.join(repoRoot, "Chronica_Verhaalteksten.txt");
fs.writeFileSync(outPath, header + body, "utf8");
console.log("written", outPath, (header + body).length, "chars");
