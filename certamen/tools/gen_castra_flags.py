"""Tekent de vlaggen voor het Praetorium (assets/tilesets/Castra_extra.png, sheet "X" in castra-map.js).
Vier objecten van 1x2 tegels (48x96): rode vlag wijzend naar links/rechts en gouden vlag naar links/rechts.
Gebruik: python tools/gen_castra_flags.py  (vanuit certamen/). Pixelkunst op 24x48 en daarna 2x vergroot."""
from PIL import Image, ImageDraw
import os

W, H = 24, 48
def flag(banner, trim, emblem, face_right):
    im = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(im)
    cx = 12
    d.ellipse([cx-7, 43, cx+7, 47], fill=(0, 0, 0, 70))                  # schaduw
    d.rectangle([cx-4, 41, cx+3, 45], fill=(120, 118, 112, 255))          # voet
    d.rectangle([cx-4, 41, cx+3, 42], fill=(160, 158, 150, 255))
    d.rectangle([cx-1, 7, cx, 41], fill=(104, 70, 32, 255))               # paal
    d.rectangle([cx-1, 7, cx-1, 41], fill=(138, 96, 46, 255))
    d.ellipse([cx-3, 2, cx+2, 7], fill=(224, 184, 74, 255))               # gouden knop
    d.rectangle([cx-1, 3, cx, 4], fill=(255, 232, 140, 255))
    # doek met golvende onderrand
    bw, bh, top = 10, 13, 9
    x0 = cx+1 if face_right else cx-1-bw+1
    for i in range(bw):
        wave = [0, 1, 1, 2, 2, 1, 1, 0, 0, 1][i if face_right else bw-1-i]
        y0 = top + (i//4)*0
        d.rectangle([x0+i, y0, x0+i, y0+bh-1+wave], fill=banner)
    d.rectangle([x0, top, x0+bw-1, top], fill=trim)                       # bovenrand
    d.rectangle([x0, top+bh-1+0, x0+bw-1, top+bh-1], fill=trim)           # onderrand (vlak)
    edge = x0 if face_right else x0+bw-1
    d.rectangle([edge, top, edge, top+bh-1], fill=trim)                   # rand aan de paal
    # embleem: een kleine adelaar/ster in het midden
    mx = x0 + bw//2; my = top + bh//2
    for dx, dy in [(0,-2),(-1,-1),(0,-1),(1,-1),(-2,0),(-1,0),(0,0),(1,0),(2,0),(-1,1),(0,1),(1,1),(-1,2),(1,2)]:
        d.point((mx+dx, my+dy), fill=emblem)
    return im.resize((W*2, H*2), Image.NEAREST)

RED, RED_D, GOLD, GOLD_L, DARK = (176, 38, 30, 255), (126, 26, 20, 255), (224, 184, 74, 255), (250, 222, 120, 255), (86, 14, 10, 255)
sheet = Image.new("RGBA", (48*4, 96), (0, 0, 0, 0))
for i, (b, t, e, fr) in enumerate([(RED, GOLD, GOLD_L, False), (RED, GOLD, GOLD_L, True), (GOLD, RED_D, DARK, False), (GOLD, RED_D, DARK, True)]):
    sheet.paste(flag(b, t, e, fr), (i*48, 0))
out = os.path.join("assets", "tilesets", "Castra_extra.png")
sheet.save(out); print("geschreven", out, sheet.size)
