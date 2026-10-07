// Genereert per klasse vier Gemini-prompts voor icoonvellen (8/8/8/4 iconen).
// Uitvoer: tools/skilltree-icon-sheets.md.
// Gebruik: node tools/skilltree-icon-sheets.js
// (De eerste proef met één vel van 28 iconen liet Gemini de opgegeven
// onderwerpen grotendeels negeren — daarom kleinere vellen, één kleur per vel.)
const fs=require("fs"), path=require("path");
eval(fs.readFileSync(path.join(__dirname,"..","skilltree-data.js"),"utf8").replace(/^const /gm,"var "));

function sheets(cls){
  const t=BM_SKILLTREES[cls], P=t.paths;
  const c=(n,acc)=>({n,acc});
  return [
    {key:"1", nm:"identiteit ★1–4", cols:4, rows:2, ratio:"16:9",
     cells:t.identity.flatMap(s=>[c(s.A,P.A.accentNm),c(s.B,P.B.accentNm)])},
    {key:"2", nm:"pad A · "+P.A.nm, cols:4, rows:2, ratio:"16:9",
     cells:t.pathNodes.A.flatMap(s=>[c(s.a,P.A.accentNm),c(s.b,P.A.accentNm)])},
    {key:"3", nm:"pad B · "+P.B.nm, cols:4, rows:2, ratio:"16:9",
     cells:t.pathNodes.B.flatMap(s=>[c(s.a,P.B.accentNm),c(s.b,P.B.accentNm)])},
    {key:"4", nm:"basis, meester, prestige", cols:2, rows:2, ratio:"1:1",
     cells:[c(t.root,t.colorNm),c(t.master,"warm gold"),
            ...t.prestige.map(p=>c(p,P[p.path].accentNm+" with extra gold"))]},
  ].map(sh=>({...sh, prompt:promptFor(t,sh)}));
}

function promptFor(t,sh){
  const n=sh.cells.length;
  const list=sh.cells.map((x,i)=>
    `${i+1}. (row ${Math.floor(i/sh.cols)+1}, column ${i%sh.cols+1}) ${x.n.iconSubject} — dominant colour ${x.acc}.`).join("\n");
  return `${sh.ratio==="1:1"?"Square 1:1":sh.ratio==="4:3"?"Landscape 4:3":"Wide 16:9"} image: a sprite sheet of exactly ${n} separate pixel-art game skill icons, arranged in ${sh.rows} rows of ${sh.cols}, for an ancient Greek/Roman strategy game (${sh.label||`class "${t.nm}"`}).

STYLE REFERENCE: the attached image is the exact style to copy — same square tiles with slightly rounded corners and thin dark border, same tile size and spacing, same pixel size, same shading and same one-colour-per-tile look. Only the subjects and colours listed below are different.

CONTENT (most important rule): draw EXACTLY the ${n} subjects listed below, each one literally as described, in this order (left to right, top to bottom). Do not replace a subject with a more generic or different object, do not add weapons, helmets, shields, animals, people or objects that are not in the description, and draw every subject only once.

${list}${sh.extra?"\n\n"+sh.extra:""}

LAYOUT: an invisible grid of ${sh.cols} columns and ${sh.rows} rows with equal cells; one icon tile centred in each cell, with clear magenta gaps between the tiles so they never touch each other or the image edge. No grid lines.

BACKGROUND: one flat, uniform pure magenta (#FF00FF) everywhere, no texture, gradient, shadow or noise (it will be removed by chroma key). Never use magenta or pink inside an icon; violet must be clearly bluish.

STYLE (keep exactly the same for every icon): each icon is a square tile with slightly rounded corners and a thin dark border, the whole tile filled with a medium shade of its listed colour (the inside of a tile is never magenta, pink or empty); on it one bold symbol, filling about 75% of the tile, drawn in lighter and darker shades of that same colour with a few small pale highlights (gold only where the list says so). Pixel art drawn as if at 64×64 pixels and enlarged with hard square pixel edges (no anti-aliasing), 16-bit RPG skill-icon style, front view, readable at 32×32; same line weight and top-left lighting for all icons.

AVOID: letters, numbers, words, watermarks; photorealism, soft gradients, blur, glow larger than 2 pixels; drop shadows on the background; round or hexagonal tiles; tiles in a different colour than listed; ${sh.people||"human figures or faces"}; crossbows, firearms, sci-fi; any object not named in the list; magenta or pink inside the icons; more or fewer than ${n} icons.`;
}

let md=`# Skill-tree-iconen — Gemini-prompts per klasse

Gegenereerd door \`tools/skilltree-icon-sheets.js\` uit \`skilltree-data.js\`
(\`iconSubject\` en padkleuren). Vier vellen per klasse (8/8/8/4 iconen),
magenta achtergrond. Sla elk resultaat op als
\`assets/skills/sheets/<klasse>_<nr>.png\` (.jpg mag ook); daarna worden de
iconen uitgesneden, vrijgemaakt en als \`assets/skills/<klasse>_<knooppunt>.png\`
weggeschreven.

**Stijlvoorbeeld meegeven (belangrijk):** voeg bij elke prompt de afbeelding
\`assets/skills/sheets/boogschutter_1.jpg\` toe — dat is de vastgestelde stijl
(gekleurde tegels). Werkt in Gemini en ChatGPT. Begin per vel een nieuw gesprek.
`;
for(const cls of Object.keys(BM_SKILLTREES)){
  md+=`\n---\n\n## ${BM_SKILLTREES[cls].nm}\n`;
  for(const sh of sheets(cls)){
    md+=`\n### Vel ${sh.key} — ${sh.nm} → \`assets/skills/sheets/${cls}_${sh.key}.png\`\n\n`+
        "```text\n"+sh.prompt+"\n```\n\n"+
        `<details><summary>Indeling</summary>\n\n| Nr | Knooppunt | Bestand |\n|---|---|---|\n`+
        sh.cells.map((x,i)=>`| ${i+1} | ${x.n.nm} | \`${x.n.icon}\` |`).join("\n")+"\n\n</details>\n";
  }
}
// Verbetervellen: losse iconen uit alle bomen die opnieuw moesten (lijsten in
// skilltree-icon-sheets-order.js). fix_1 = eerste ronde (Gemini; fix_2 =
// dezelfde prompt via ChatGPT), fix_3 = tweede ronde "kan mooier".
const ord=require("./skilltree-icon-sheets-order.js");
for(const [key,cols,rows,ratio,people,intro,extra] of [
  ["1",4,3,"4:3","human figures or faces, except the rider in icon 10 and the sphinx head in icon 9",
   "Iconen die bij de eerste ronde misgingen of beter konden. Via ChatGPT opgeslagen als `fix_2` — die versie is gebruikt."],
  ["3",4,4,"1:1","human figures or faces, except the sleeping figure in icon 12, the Pythia in icon 13 and the hooded figure in icon 16",
   "Tweede ronde: iconen die klopten maar mooier of preciezer konden (middeleeuwse puntschilden, ontbrekende details, weinig contrast). Bedoeld voor ChatGPT."],
  ["5",2,2,"1:1","human figures or faces, except the small robed figures in icon 4",
   "Vierde ronde: de vier nieuwe Priester-knooppunten (Ambrosia, Zegenstroom, Lichtmantel, Gemeenschap). Bedoeld voor ChatGPT; opslaan als fix_5."],
  ["4",2,1,"16:9","human figures or faces",
   "Derde ronde: Les van Delphi (werd een grafsteen) en de basis van de Bevelvoerder (kam liep van voor naar achter). Uitgebreide omschrijving per icoon.",
   "EXTRA DETAIL FOR ICON 1 (Delphi omphalos): the stone must be clearly ROUNDED like an egg or beehive — it is NOT a flat slab, NOT a tablet, NOT a gravestone or tombstone, NOT a rectangle with a rounded top. Its whole surface shows a carved criss-cross net pattern of raised bands. It stands on a small low square plinth. Above its rounded top floats a small glowing eye with a few short light rays. No letters, no inscription, no cross, no flowers.\n\n"+
   "EXTRA DETAIL FOR ICON 2 (centurion helmet): this is the helmet of a Roman centurion, whose crest is famously worn SIDEWAYS (transverse). Seen from the front, the red horsehair crest therefore appears as a broad fan or half-circle spreading out to the LEFT and RIGHT across the top of the helmet, wider than the helmet itself. It is NOT a front-to-back crest and NOT a narrow mohawk ridge. The helmet is bright polished silver steel with a brass brow band, two hinged cheek guards and a short neck guard visible at the sides. Nobody wears the helmet; no face inside."],
]){
  const cells=ord.fixList(key).map(i=>{ const f=ord.findIcon(BM_SKILLTREES,i); return {n:f.n,acc:f.acc,cls:f.t.nm}; });
  const sh={key:"fix"+key, cols, rows, ratio, cells, label:"mixed icons from several classes", people, extra};
  sh.prompt=promptFor(null,sh);
  md+="\n---\n\n## Verbetervel "+key+" → `assets/skills/sheets/fix_"+key+".png`\n\n"+intro+"\n\n"+
      "```text\n"+sh.prompt+"\n```\n\n"+
      "<details><summary>Indeling</summary>\n\n| Nr | Klasse | Knooppunt | Bestand |\n|---|---|---|---|\n"+
      cells.map((x,i)=>`| ${i+1} | ${x.cls} | ${x.n.nm} | \`${x.n.icon}\` |`).join("\n")+"\n\n</details>\n";
}
fs.writeFileSync(path.join(__dirname,"skilltree-icon-sheets.md"),md);
console.log("ok");
