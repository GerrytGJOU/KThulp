#!/usr/bin/env python3
"""Snijdt de vier kaartbladen (dnd/_prive/kaartbladen/, niet in git) tot losse webp's in dnd/assets/battle/.
Bladen en prompt: dnd/tools/PROMPT_KAARTTOKENS.md. Verhoog na opnieuw snijden ARTV in battlemap.js. Gebruik: python dnd/tools/slice-battle-sheets.py"""
import os
from PIL import Image, ImageChops

DND = os.path.join(os.path.dirname(__file__), "..")
SRC = os.path.join(DND, "_prive", "kaartbladen")
OUT = os.path.join(DND, "assets", "battle")

NAMES = {
    "natuur": "loofboom den dodeboom stronk rots rotsblokken struik doornstruik boomstam riet waterlelies paddenstoelen varens wortels brandhout graspol",
    "kamp-en-ruine": "kampvuur tent slaaprol kist ton kratten tafel kar zuil muurstuk puin sokkel put vuurkorf altaar deur",
    "grond": "gras bos aarde karrenpad keien plavuis grot planken water diepwater sneeuw zand moeras puingrond muur rotswand",
    "vijanden": "ork orkboog orkhoofd orkzwaar goblin warg wolf wargruiter trol spin grafgeest skelet rover oosterling vleermuizen gestalte",
}
# deze texturen hebben rechte voegen; overvloeien zou daar dubbele lijnen geven
HARD_EDGES = {"plavuis", "planken", "muur"}


def cell(im, i, inset=0):
    w = im.width / 4
    x, y = i % 4, i // 4
    return im.crop((round(x * w) + inset, round(y * w) + inset, round((x + 1) * w) - inset, round((y + 1) * w) - inset))


def cutout(im):
    """magenta wordt doorzichtig; roze randjes worden ontkleurd"""
    out = []
    for r, g, b in im.convert("RGB").getdata():
        m = min(r, b) - g
        a = 255 if m <= 60 else 0 if m >= 160 else round(255 * (160 - m) / 100)
        if m > 18:
            r, b = r - (m - 10), b - (m - 10)
        out.append((r, g, b, a))
    res = Image.new("RGBA", im.size)
    res.putdata(out)
    return res


def square(im, size):
    box = im.getchannel("A").point(lambda a: 255 if a > 40 else 0).getbbox()
    edge = box[0] == 0 or box[1] == 0 or box[2] == im.width or box[3] == im.height
    im = im.crop(box)
    side = round(max(im.size) * 1.04)
    s = Image.new("RGBA", (side, side))
    s.paste(im, ((side - im.width) // 2, (side - im.height) // 2))
    return s.resize((size, size), Image.LANCZOS), edge


def seamless(im):
    """vloeit de randen over in een half verschoven kopie, zodat de tegel naadloos herhaalt"""
    w, h = im.size
    shifted = ImageChops.offset(im, w // 2, h // 2)
    ramp = lambda i, n: min(1.0, min(i, n - 1 - i) / (n * 0.22))  # 0 aan de rand, 1 in het midden
    mask = Image.new("L", im.size)
    mask.putdata([round(255 * ramp(x, w) * ramp(y, h)) for y in range(h) for x in range(w)])
    return Image.composite(im, shifted, mask)


def main():
    os.makedirs(OUT, exist_ok=True)
    for sheet, names in NAMES.items():
        im = Image.open(os.path.join(SRC, sheet + ".png")).convert("RGB")
        for i, name in enumerate(names.split()):
            if sheet == "grond":
                tile = cell(im, i, 4)
                if name == "muur":  # het blad toont een muurstrook: alleen de bovenste stenen gebruiken
                    tile = cell(im, i).crop((70, 84, 182, 196))
                tile = tile.resize((256, 256), Image.LANCZOS)
                if name not in HARD_EDGES:
                    tile = seamless(tile)
                tile.save(os.path.join(OUT, "g-" + name + ".webp"), quality=82)
            elif sheet == "vijanden":
                cell(im, i, 6).resize((192, 192), Image.LANCZOS).save(os.path.join(OUT, "v-" + name + ".webp"), quality=84)
            else:
                s, edge = square(cutout(cell(im, i)), 192)
                if edge:
                    print("let op: raakt de celrand:", name)
                s.save(os.path.join(OUT, "o-" + name + ".webp"), quality=86)
    files = os.listdir(OUT)
    print(len(files), "bestanden,", sum(os.path.getsize(os.path.join(OUT, f)) for f in files) // 1024, "kB")


if __name__ == "__main__":
    main()
