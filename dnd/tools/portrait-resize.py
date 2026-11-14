"""Verkleint een afbeelding tot een JPEG-data-URL voor npcs/{sleutel}/img (zelfde formaat als de app: max 360 px, kwaliteit .82).
Gebruik: python -I portrait-resize.py <invoer> <uitvoer.txt> [max=360]
Schrijft de data-URL in <uitvoer.txt>; stdout: "OK <breedte>x<hoogte> <aantal tekens>". Geen netwerk, geen geheimen."""
import sys, base64, io
from PIL import Image

src, out = sys.argv[1], sys.argv[2]
mx = int(sys.argv[3]) if len(sys.argv) > 3 else 360
im = Image.open(src)
im.load()
if im.mode in ("RGBA", "LA", "P"):
    im = im.convert("RGBA")
    bg = Image.new("RGB", im.size, (20, 18, 16))
    bg.paste(im, mask=im.split()[-1])
    im = bg
else:
    im = im.convert("RGB")
w, h = im.size
s = min(1.0, mx / max(w, h))
if s < 1.0:
    im = im.resize((max(1, round(w * s)), max(1, round(h * s))), Image.LANCZOS)
for q in (82, 74, 66, 58):
    buf = io.BytesIO()
    im.save(buf, "JPEG", quality=q, optimize=True)
    if len(buf.getvalue()) <= 60000:
        break
data = "data:image/jpeg;base64," + base64.b64encode(buf.getvalue()).decode("ascii")
open(out, "w", encoding="ascii").write(data)
print("OK %dx%d %d" % (im.size[0], im.size[1], len(data)))
