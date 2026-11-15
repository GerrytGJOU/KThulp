#!/usr/bin/env node
/* Tekent alle pins uit dnd/map-data.js op de kaart (genummerd) en schrijft gecropte controle-afbeeldingen, zodat de coördinaten
   met het oog gecontroleerd kunnen worden (nooit coördinaten op gevoel zetten). Vereist Python met Pillow.
   Gebruik: node dnd/tools/map-overlay.js <uitvoermap> [x0 y0 x1 y1]   (zonder crop: vier kwadranten) */
"use strict";
const fs = require("fs"), path = require("path"), { spawnSync } = require("child_process");
const M = require("../map-data.js");
const out = process.argv[2]; if (!out) { console.error("Geef een uitvoermap"); process.exit(2); }
fs.mkdirSync(out, { recursive: true });
const data = path.join(out, "pins.json"); fs.writeFileSync(data, JSON.stringify(M.PLACES.map((p, i) => ({ n: i + 1, id: p.id, x: p.x, y: p.y, fic: !!p.fictional }))));
const py = path.join(out, "overlay.py");
fs.writeFileSync(py, [
  "import sys, json",
  "from PIL import Image, ImageDraw, ImageFont",
  "src, data, out = sys.argv[1], sys.argv[2], sys.argv[3]",
  "boxes = [list(map(int, sys.argv[4:8]))] if len(sys.argv) > 7 else [[0,0,1000,600],[1000,0,2000,600],[0,500,1000,1091],[1000,500,2000,1091]]",
  "pins = json.load(open(data))",
  "try: f = ImageFont.truetype('arial.ttf', 15)",
  "except Exception: f = ImageFont.load_default()",
  "for bi, (x0,y0,x1,y1) in enumerate(boxes):",
  "    im = Image.open(src).convert('RGB'); d = ImageDraw.Draw(im)",
  "    for p in pins:",
  "        r = 6; d.ellipse([p['x']-r, p['y']-r, p['x']+r, p['y']+r], fill=(200,0,0) if not p['fic'] else (0,120,200), outline=(255,255,255))",
  "        d.text((p['x']+8, p['y']-8), str(p['n']) + ' ' + p['id'], fill=(120,0,0), font=f)",
  "    im.crop((x0,y0,x1,y1)).save(out + '/overlay-' + str(bi+1) + '.png')",
  "print('ok', len(boxes))"
].join("\n"));
const args = [py, path.join(__dirname, "..", M.MAP.file), data, out].concat(process.argv.slice(3, 7));
const r = spawnSync("python3", ["-I"].concat(args), { encoding: "utf8" }); console.log((r.stdout || r.stderr || "").trim());
