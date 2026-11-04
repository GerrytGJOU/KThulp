#!/usr/bin/env python3
"""Zet PNG/JPG-afbeeldingen in certamen/assets/ om naar WebP en bewaart de originelen
buiten Git (in <repo>/_archief/originelen/..., staat in .gitignore).

Gebruik (vanuit de repo-root):  python certamen/tools/img-naar-webp.py [--dry]

- Foto-achtige/grote kunst (combat, maps, bosses, battlebacks, commanders): lossy q85, alfa blijft.
- Pixelart/iconen/sprites (sprites-forms, portraits, skills, kleine bosssprites): lossless.
- Alleen als het WebP kleiner is dan het origineel; anders blijft het bestand zoals het is.
- Schrijft de oud->nieuw-lijst naar certamen/tools/img-naar-webp-mapping.json zodat de
  verwijzingen in de code te controleren zijn.
Verwijzingen in de code moeten daarna nog aangepast worden (de bestandsnaam blijft gelijk, alleen
de extensie wordt .webp).
"""
import json, os, shutil, sys
from concurrent.futures import ProcessPoolExecutor
from PIL import Image

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
ASSETS = os.path.join(ROOT, "certamen", "assets")
ARCHIEF = os.path.join(ROOT, "_archief", "originelen")

# (map, modus, recursief)  modus: "lossy" | "lossless" | "auto" (lossless als de lange zijde <= 400 px)
REGELS = [
    ("chronica/combat", "lossy"),
    ("chronica/maps", "lossy"),
    ("chronica/images", "lossy"),      # alleen de .jpg's; de .webp's zijn al klaar
    ("bosses", "auto"),
    ("battlebacks", "lossy"),
    ("commanders", "lossy"),
    ("sprites-forms", "lossless"),
    ("portraits", "lossless"),
    ("skills", "lossless"),            # alleen losse iconen, niet skills/sheets (gitignored)
]
SKIP_DELEN = ("_bron", "_preview_", os.sep + "sheets" + os.sep)


def taak(pad):
    rel = os.path.relpath(pad, ASSETS).replace(os.sep, "/")
    modus = None
    for d, m in REGELS:
        if rel.startswith(d + "/"):
            modus = m
    im = Image.open(pad)
    im.load()
    if modus == "auto":
        modus = "lossless" if max(im.size) <= 400 else "lossy"
    if im.mode not in ("RGB", "RGBA"):
        im = im.convert("RGBA" if ("transparency" in im.info or im.mode in ("LA", "PA", "P")) else "RGB")
    nieuw = os.path.splitext(pad)[0] + ".webp"
    tmp = nieuw + ".tmp"
    if modus == "lossless":
        im.save(tmp, "WEBP", lossless=True, quality=100, method=6)
    else:
        im.save(tmp, "WEBP", quality=85, method=6)
    oud_b, nw_b = os.path.getsize(pad), os.path.getsize(tmp)
    if nw_b >= oud_b:
        os.remove(tmp)
        return (rel, None, oud_b, oud_b, modus)
    if os.path.exists(nieuw):
        os.remove(tmp)
        return (rel, None, oud_b, oud_b, "bestaat al")
    os.replace(tmp, nieuw)
    dest = os.path.join(ARCHIEF, "certamen", "assets", rel.replace("/", os.sep))
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    shutil.move(pad, dest)
    return (rel, os.path.relpath(nieuw, ASSETS).replace(os.sep, "/"), oud_b, nw_b, modus)


def main():
    dry = "--dry" in sys.argv
    bestanden = []
    for d, _ in REGELS:
        for dp, dns, fns in os.walk(os.path.join(ASSETS, d.replace("/", os.sep))):
            for fn in fns:
                p = os.path.join(dp, fn)
                if any(s in p for s in SKIP_DELEN):
                    continue
                if fn.lower().endswith((".png", ".jpg", ".jpeg")):
                    bestanden.append(p)
    bestanden = sorted(set(bestanden))
    print(len(bestanden), "bestanden")
    if dry:
        return
    mapping, oud, nw = {}, 0, 0
    with ProcessPoolExecutor() as ex:
        for rel, nieuw, ob, nb, modus in ex.map(taak, bestanden, chunksize=8):
            oud += ob; nw += nb
            if nieuw:
                mapping[rel] = nieuw
            else:
                print("overgeslagen:", rel, modus)
    with open(os.path.join(os.path.dirname(__file__), "img-naar-webp-mapping.json"), "w", encoding="utf-8") as f:
        json.dump(mapping, f, indent=0, ensure_ascii=False)
    print("omgezet:", len(mapping), "| %.1f MB -> %.1f MB" % (oud / 1048576, nw / 1048576))


if __name__ == "__main__":
    main()
