# Snijdt een Gemini-icoonvel (assets/skills/sheets/<klasse>_<nr>.jpg/.png) in
# losse iconen en schrijft ze als assets/skills/<icon>.png (128 px, magenta
# vrijgemaakt). De volgorde komt uit tools/skilltree-icon-sheets.js (via node).
# Gebruik: python tools/skilltree-icon-slice.py boogschutter 1 [--order 1,2,...]
#          [--boxes-from hopliet_2]  (tegelposities van een ander vel overnemen,
#          als de achtergrond niet egaal magenta is)
import sys, os, json, subprocess
from PIL import Image

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SIZE = 128
INSET = 0.045

def cells_for(cls, key):
    js = ("const fs=require('fs');eval(fs.readFileSync('skilltree-data.js','utf8').replace(/^const /gm,'var '));"
          "const s=require('./tools/skilltree-icon-sheets-order.js')(BM_SKILLTREES,%r,%r);console.log(JSON.stringify(s));" % (cls, key))
    out = subprocess.check_output(["node", "-e", js], cwd=ROOT)
    return json.loads(out)

def is_bg(p):
    r, g, b = p[:3]
    return r > 170 and b > 170 and g < 110

def components(im):
    """Bounding boxes van niet-magenta blokken, via rij-/kolomprojecties."""
    w, h = im.size; px = im.load()
    def runs(fg, n, minlen):
        out, start = [], None
        for i in range(n):
            if fg[i] and start is None: start = i
            if not fg[i] and start is not None:
                if i - start >= minlen: out.append((start, i))
                start = None
        if start is not None and n - start >= minlen: out.append((start, n))
        return out
    rowfg = [sum(1 for x in range(0, w, 2) if not is_bg(px[x, y])) > 3 for y in range(h)]
    boxes = []
    for (y0, y1) in runs(rowfg, h, 20):
        colfg = [any(not is_bg(px[x, y]) for y in range(y0, y1, 2)) for x in range(w)]
        for (x0, x1) in runs(colfg, w, 20):
            boxes.append((x0, y0, x1, y1))
    return boxes

def main():
    cls, key = sys.argv[1], sys.argv[2]
    order = None
    if "--order" in sys.argv:
        order = [int(v) - 1 for v in sys.argv[sys.argv.index("--order") + 1].split(",")]
    src = None
    # vel mag ook de weergavenaam dragen (bv. voorvechter_1 voor klasse spartaan)
    alias = {"spartaan": "voorvechter", "centurio": "bevelvoerder"}.get(cls, cls)
    for pre in (cls, alias):
        for ext in (".png", ".jpg", ".jpeg", ".webp"):
            p = os.path.join(ROOT, "assets", "skills", "sheets", f"{pre}_{key}{ext}")
            if os.path.exists(p) and not src: src = p
    if not src: sys.exit("vel niet gevonden")
    im = Image.open(src).convert("RGBA")
    if "--boxes-from" in sys.argv:
        ref = sys.argv[sys.argv.index("--boxes-from") + 1]
        rp = next(os.path.join(ROOT, "assets", "skills", "sheets", ref + e) for e in (".png", ".jpg", ".jpeg", ".webp")
                  if os.path.exists(os.path.join(ROOT, "assets", "skills", "sheets", ref + e)))
        rim = Image.open(rp).convert("RGBA")
        assert rim.size == im.size, "vellen verschillen van formaat"
        boxes = components(rim)
    else:
        boxes = components(im)
    cells = cells_for(cls, key)
    print(f"{len(boxes)} blokken gevonden, {len(cells)} verwacht")
    if order: boxes = [boxes[i] for i in order]
    for box, cell in zip(boxes, cells):
        # binnen de donkere tegelrand van Gemini knippen (de zeshoek is de rand)
        ix, iy = round((box[2]-box[0]) * INSET), round((box[3]-box[1]) * INSET)
        tile = im.crop((box[0]+ix, box[1]+iy, box[2]-ix, box[3]-iy))
        px = tile.load()
        for y in range(tile.size[1]):
            for x in range(tile.size[0]):
                if is_bg(px[x, y]): px[x, y] = (0, 0, 0, 0)
        tw, th = tile.size; s = max(tw, th)
        sq = Image.new("RGBA", (s, s), (0, 0, 0, 0)); sq.paste(tile, ((s - tw) // 2, (s - th) // 2))
        sq = sq.resize((SIZE, SIZE), Image.LANCZOS)
        out = os.path.join(ROOT, "assets", "skills", cell["icon"])
        sq.save(out)
        print(f"  {cell['nm']:<24} -> {cell['icon']}  ({box[2]-box[0]}x{box[3]-box[1]})")

main()
