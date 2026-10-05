// Genereert per klasse één Gemini-prompt voor een icoonvel (8×4 raster,
// 28 iconen). Uitvoer: tools/skilltree-icon-sheets.md.
// Gebruik: node tools/skilltree-icon-sheets.js
const fs=require("fs"), path=require("path");
eval(fs.readFileSync(path.join(__dirname,"..","skilltree-data.js"),"utf8").replace(/^const /gm,"var "));

function sheet(cls){
  const t=BM_SKILLTREES[cls], P=t.paths;
  const cell=(n,acc)=>({n,acc});
  const rows=[
    t.identity.flatMap(s=>[cell(s.A,P.A.accentNm),cell(s.B,P.B.accentNm)]),
    t.pathNodes.A.flatMap(s=>[cell(s.a,P.A.accentNm),cell(s.b,P.A.accentNm)]),
    t.pathNodes.B.flatMap(s=>[cell(s.a,P.B.accentNm),cell(s.b,P.B.accentNm)]),
    [cell(t.root,t.colorNm),cell(t.master,"warm gold"),
     ...t.prestige.map(p=>cell(p,P[p.path].accentNm+" with extra gold"))],
  ];
  let list="", map=[];
  rows.forEach((r,ri)=>r.forEach((c,ci)=>{
    list+=`Row ${ri+1}, cell ${ci+1}: ${c.n.iconSubject} — dominant colour ${c.acc}.\n`;
    map.push(`| ${ri+1} | ${ci+1} | ${c.n.nm} | \`${c.n.icon}\` |`);
  }));
  const prompt=
`Wide 16:9 image: a sprite sheet of 28 separate pixel-art game skill icons for an ancient Greek/Roman strategy game, class "${t.nm}" (${t.colorNm}).

LAYOUT (strict): an invisible grid of 8 columns and 4 rows, all cells equal size. Exactly one icon centred in each cell, filling about 70% of the cell, with generous empty space between icons so they never touch or overlap. Rows 1-3 have 8 icons each; row 4 has icons only in cells 1-4 — cells 5-8 of row 4 stay completely empty. No grid lines, no frames, no tiles, no borders around the icons.

BACKGROUND: the entire image background is one flat, uniform pure magenta (#FF00FF), with no texture, gradient, shadow, vignette or noise — it will be removed by chroma key. Never use magenta, pink or hot pink inside any icon; violet and purple must be clearly bluish.

STYLE: every icon drawn as if at 64×64 pixel resolution and enlarged with hard square pixel edges (no anti-aliasing, no smoothing), 16-bit RPG skill-icon style, seen straight from the front, readable at 32×32. Each icon is one single bold symbol with a 1-pixel dark brown outline, max. 8 colours, dominated by its own colour given below, with gold (#d4af37) highlights and dark brown shadows. All 28 icons share the same style, line weight and lighting (light from top-left), but each subject is clearly different from the others.

ICONS (left to right, top to bottom):
${list}
AVOID: any letters, numbers, words or labels; watermarks or signatures; photorealism; soft gradients, blur or glow halos larger than 2 pixels; drop shadows on the background; tiles, frames, borders or grid lines; modern firearms or sci-fi elements; detailed human faces; magenta or pink inside the icons; icons touching each other or the image edge; duplicated icons; extra icons in row 4 cells 5-8.`;
  return {prompt,map};
}

let md=`# Skill-tree-iconen — Gemini-prompts per klasse

Gegenereerd door \`tools/skilltree-icon-sheets.js\` uit \`skilltree-data.js\`
(\`iconSubject\` en padkleuren). Eén vel per klasse, 8 × 4 raster, magenta
achtergrond. Sla het resultaat op als \`assets/skills/sheets/<klasse>.png\`;
daarna worden de iconen uitgesneden, vrijgemaakt en als
\`assets/skills/<klasse>_<knooppunt>.png\` weggeschreven.

Rij 1 = identiteitskeuzes ★1–4 (A/B om en om), rij 2 = pad A ★6–9 (a/b),
rij 3 = pad B ★6–9 (a/b), rij 4 = basis, meester, de twee prestige-varianten.
`;
for(const c of Object.keys(BM_SKILLTREES)){
  const {prompt,map}=sheet(c);
  md+=`\n---\n\n## ${BM_SKILLTREES[c].nm} → \`assets/skills/sheets/${c}.png\`\n\n\`\`\`text\n${prompt}\n\`\`\`\n\n<details><summary>Rasterindeling</summary>\n\n| Rij | Cel | Knooppunt | Bestand |\n|---|---|---|---|\n${map.join("\n")}\n\n</details>\n`;
}
fs.writeFileSync(path.join(__dirname,"skilltree-icon-sheets.md"),md);
console.log("ok");
