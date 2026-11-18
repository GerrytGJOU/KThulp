"""Snijdt een ChatGPT-icoonblad (4 x 4 cellen) in losse iconen voor dnd/assets/items/.
Gebruik (altijd met -I): python -I dnd/tools/items-slice.py <blad.png> <id1,id2,...,id16> [uitmap]
Een lege plek in het blad: gebruik "-" als id. Elk icoon wordt 128 x 128 px (witte achtergrond, vierkant, .webp, onder ~15 KB).
Bronbladen horen buiten de repo (dnd/_prive/itemsheets/ is git-genegeerd)."""
import os
import sys
from PIL import Image, ImageChops, ImageFilter


def main():
    if len(sys.argv) < 3:
        print(__doc__)
        sys.exit(1)
    sheet, ids = sys.argv[1], sys.argv[2].split(",")
    out = sys.argv[3] if len(sys.argv) > 3 else os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "assets", "items")
    if len(ids) != 16:
        sys.exit("Geef precies 16 id's (rij voor rij, links naar rechts; '-' voor een lege plek).")
    os.makedirs(out, exist_ok=True)
    im = Image.open(sheet).convert("RGB")
    W, H = im.size
    for n, id_ in enumerate(ids):
        if id_ in ("", "-"):
            continue
        r, c = divmod(n, 4)
        cell = im.crop((c * W // 4, r * H // 4, (c + 1) * W // 4, (r + 1) * H // 4))
        bg = Image.new("RGB", cell.size, (255, 255, 255))
        mask = ImageChops.difference(cell, bg).convert("L").point(lambda v: 255 if v > 18 else 0)
        # losse stipjes van een naburige cel negeren
        bb = mask.filter(ImageFilter.MinFilter(5)).filter(ImageFilter.MaxFilter(5)).getbbox() or (0, 0) + cell.size
        bb = (max(0, bb[0] - 3), max(0, bb[1] - 3), min(cell.width, bb[2] + 3), min(cell.height, bb[3] + 3))
        obj = cell.crop(bb)
        s = max(obj.size)
        m = int(s * 0.06)
        sq = Image.new("RGB", (s + 2 * m, s + 2 * m), (255, 255, 255))
        sq.paste(obj, ((s - obj.width) // 2 + m, (s - obj.height) // 2 + m))
        sq = sq.resize((128, 128), Image.LANCZOS)
        p = os.path.join(out, id_ + ".webp")
        for q in (80, 70, 60, 50):
            sq.save(p, "WEBP", quality=q, method=6)
            if os.path.getsize(p) < 15000:
                break
        print(id_, os.path.getsize(p), "bytes")


main()
