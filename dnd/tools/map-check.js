#!/usr/bin/env node
/* Controleert de pins van een kaart van een setting: tekent elke plaats (en regiopunt) met zijn id op het kaartbestand en schrijft
   afbeeldingen om met het oog te controleren (nooit coördinaten op gevoel zetten). Vereist Python met Pillow.
   Gebruik: node dnd/tools/map-check.js <setting-id> <kaart-id> <uitvoermap> [x0 y0 x1 y1]
   Zonder crop: één overzichtsafbeelding (max 1600 px breed). Met crop: dat deel op ware grootte (max 1600 px breed).
   Met --grid: tekent ook een raster (elke 100 px) met coördinaten, handig om nieuwe plaatsen af te lezen. */
"use strict";
const fs = require("fs"), path = require("path"), { spawnSync } = require("child_process");
const args = process.argv.slice(2), grid = args.includes("--grid"), pos = args.filter(a => a !== "--grid");
const [sid, mid, out] = pos; if (!sid || !mid || !out) { console.error("Gebruik: map-check.js <setting-id> <kaart-id> <uitvoermap> [x0 y0 x1 y1] [--grid]"); process.exit(2); }
const D = require("../settings-all.js"); require("../settings-maps.js");
const Lib = require("../map-lib.js"), S = D.get(sid), L = S.map && S.map.maps ? Lib.make(S.map) : null;
if (!L || !L.maps[mid]) { console.error("Setting of kaart niet gevonden. Kaarten: " + (L ? L.mapIds.join(", ") : "(geen)")); process.exit(1); }
const m = L.maps[mid], pins = L.placesOn(mid).map(o => ({ id: o.place.id, x: o.x, y: o.y, kind: "plaats", zoom: !!o.place.zoom }));
Object.keys(L.REGIONS).forEach(k => { const r = L.REGIONS[k]; if (r.map === mid) pins.push({ id: k, x: r.x, y: r.y, kind: "regio" }); });
fs.mkdirSync(out, { recursive: true });
const data = path.join(out, "pins-" + mid + ".json"); fs.writeFileSync(data, JSON.stringify(pins));
const py = path.join(out, "check.py");
fs.writeFileSync(py, [
  "import sys, json",
  "from PIL import Image, ImageDraw, ImageFont",
  "Image.MAX_IMAGE_PIXELS = None",
  "src, data, dst, grid = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4] == '1'",
  "box = list(map(int, sys.argv[5:9])) if len(sys.argv) > 8 else None",
  "im = Image.open(src).convert('RGB'); W, H = im.size",
  "x0, y0, x1, y1 = box if box else (0, 0, W, H)",
  "im = im.crop((x0, y0, x1, y1)); sc = min(1.0, 1600.0 / im.width) if box else min(1.0, 1600.0 / im.width)",
  "im = im.resize((int(im.width * sc), int(im.height * sc)))",
  "d = ImageDraw.Draw(im)",
  "try: f = ImageFont.truetype('arial.ttf', 14)",
  "except Exception: f = ImageFont.load_default()",
  "if grid:",
  "  step = 100 if (x1 - x0) > 700 else 50",
  "  for gx in range((x0 // step + 1) * step, x1, step):",
  "    X = (gx - x0) * sc; d.line([(X, 0), (X, im.height)], fill=(255, 0, 255), width=1); d.text((X + 2, 2), str(gx), fill=(255, 0, 255), font=f)",
  "  for gy in range((y0 // step + 1) * step, y1, step):",
  "    Y = (gy - y0) * sc; d.line([(0, Y), (im.width, Y)], fill=(255, 0, 255), width=1); d.text((2, Y + 2), str(gy), fill=(255, 0, 255), font=f)",
  "for p in json.load(open(data)):",
  "  if not (x0 <= p['x'] <= x1 and y0 <= p['y'] <= y1): continue",
  "  X, Y = (p['x'] - x0) * sc, (p['y'] - y0) * sc; c = (0, 90, 255) if p['kind'] == 'regio' else (230, 0, 0)",
  "  d.ellipse([X - 6, Y - 6, X + 6, Y + 6], outline=c, width=3); d.line([(X - 10, Y), (X + 10, Y)], fill=c, width=1); d.line([(X, Y - 10), (X, Y + 10)], fill=c, width=1)",
  "  t = p['id'] + (' ⌕' if p.get('zoom') else ''); tw = d.textlength(t, font=f); d.rectangle([X + 8, Y - 9, X + 10 + tw, Y + 7], fill=(255, 255, 255)); d.text((X + 9, Y - 9), t, fill=c, font=f)",
  "im.save(dst, quality=85)"
].join("\n"));
const file = path.join(__dirname, "..", m.file), dst = path.join(out, mid + (pos[3] ? "-crop-" + pos.slice(3, 7).join("_") : "") + ".jpg");
const a = ["-I", py, file, data, dst, grid ? "1" : "0"].concat(pos.length >= 7 ? pos.slice(3, 7) : []);
const r = spawnSync("python", a, { encoding: "utf8" });
if (r.status !== 0) { console.error((r.stderr || r.stdout || "Python faalde").trim().slice(0, 400)); process.exit(1); }
console.log(dst + "  (" + pins.length + " pins op kaart '" + mid + "', " + m.w + "x" + m.h + ")");
