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
  return `${sh.ratio==="1:1"?"Square 1:1":"Wide 16:9"} image: a sprite sheet of exactly ${n} separate pixel-art game skill icons, arranged in ${sh.rows} rows of ${sh.cols}, for an ancient Greek/Roman strategy game (class "${t.nm}").

CONTENT (most important rule): draw EXACTLY the ${n} subjects listed below, each one literally as described, in this order (left to right, top to bottom). Do not replace a subject with a more generic or different object, do not add weapons, helmets, shields, animals, people or objects that are not in the description, and draw every subject only once.

${list}

LAYOUT: an invisible grid of ${sh.cols} columns and ${sh.rows} rows with equal cells; one icon centred in each cell, filling about 70% of the cell, with clear empty space between icons so they never touch each other or the image edge. No grid lines, frames, tiles, badges or circles behind the icons.

BACKGROUND: one flat, uniform pure magenta (#FF00FF) everywhere, no texture, gradient, shadow or noise (it will be removed by chroma key). Never use magenta or pink inside an icon; violet must be clearly bluish.

STYLE: drawn as if at 64×64 pixels and enlarged with hard square pixel edges (no anti-aliasing), 16-bit RPG skill-icon style, front view, readable at 32×32. Each icon is one bold symbol with a 1-pixel dark brown outline, max. 8 colours, clearly dominated by its listed colour, with gold (#d4af37) highlights and dark brown shadows; same line weight and top-left lighting for all icons.

AVOID: letters, numbers, words, watermarks; photorealism, soft gradients, blur, glow larger than 2 pixels; drop shadows on the background; human figures or faces; crossbows, firearms, sci-fi; any object not named in the list; magenta or pink inside the icons; more or fewer than ${n} icons.`;
}

let md=`# Skill-tree-iconen — Gemini-prompts per klasse

Gegenereerd door \`tools/skilltree-icon-sheets.js\` uit \`skilltree-data.js\`
(\`iconSubject\` en padkleuren). Vier vellen per klasse (8/8/8/4 iconen),
magenta achtergrond. Sla elk resultaat op als
\`assets/skills/sheets/<klasse>_<nr>.png\` (.jpg mag ook); daarna worden de
iconen uitgesneden, vrijgemaakt en als \`assets/skills/<klasse>_<knooppunt>.png\`
weggeschreven.
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
fs.writeFileSync(path.join(__dirname,"skilltree-icon-sheets.md"),md);
console.log("ok");
