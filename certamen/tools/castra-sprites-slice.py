#!/usr/bin/env python3
"""Snijdt een AI-spritesheet voor Castra Heroum op tot losse, spelklare PNG's.

Gebruik:
  python certamen/tools/castra-sprites-slice.py blad_a.png rom_hastatus a          [uitmap]
  python certamen/tools/castra-sprites-slice.py blad_b.png rom_hastatus b          [uitmap]
  python certamen/tools/castra-sprites-slice.py portret.png hero_aeneas portrait   [uitmap]
  Voeg --boost toe (bv. voor Gemini-bladen) om kleur en contrast op te voeren voor kleine sprites.

Blad A  (tower defence): 3 kolommen x 2 rijen, in volgorde
        rust | aanval | geraakt  /  loop omlaag | loop opzij (kijkt naar RECHTS) | loop omhoog
        -> [id]_td_idle/attack/hurt/down/side/up.png (96x96; het spel toont ze op 48 css-pixels, dus scherper op een telefoon) en [id]_td.png (= rust, wat het spel nu leest)
Blad B  (battle en portret): 3 cellen naast elkaar: portret | battle voor | battle achter
        -> [id]_portrait.png (128x128), [id]_battle_front.png en [id]_battle_back.png (192x192)
Portret: een los portret -> [id]_portrait.png (128x128)

De achtergrond is effen magenta (#FF00FF, met marge voor ruis). Alle frames van een blad krijgen
dezelfde schaal (bepaald door het rustframe), staan met de voeten op dezelfde lijn en worden naar
maximaal 32 kleuren gebracht met harde (aan/uit) transparantie, zoals pixel-art hoort.
Vereist Pillow (pip install pillow). Schrijft ook [id]_preview.png (x6) om te controleren.
"""
import os, sys
from PIL import Image

PALET = 64          # 0 = geen kleurreductie
BOOST = False       # --boost: meer kleur en contrast (nuttig voor flauwere bronnen)
SIZES = {"td": 96, "battle": 192, "portrait": 128}   # td: 96 (was 48), battle: 192 (was 96) sinds het grotere gevechtsscherm (castra-vscene.js); het spel schaalt oude 96-bestanden mee
TD_NAMES = ["idle", "attack", "hurt", "down", "side", "up"]


def is_bg(r, g, b):
    # magenta-achtig: veel rood en blauw, weinig groen (ruim genoeg voor jpeg- en webp-ruis)
    return r > 150 and b > 150 and g < 120 and abs(r - b) < 90


def key(im):
    im = im.convert("RGBA"); px = im.load(); w, h = im.size
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if is_bg(r, g, b):
                px[x, y] = (0, 0, 0, 0)
    # roze randpixels: gedeeltelijk magenta (r en b hoog, g laag) naast transparant -> verwijderen
    for _ in range(2):
        cut = []
        for y in range(1, h - 1):
            for x in range(1, w - 1):
                r, g, b, a = px[x, y]
                if a and r > 130 and b > 110 and g < r * 0.62 and g < b * 0.75:
                    if any(px[x + dx, y + dy][3] == 0 for dx, dy in ((1, 0), (-1, 0), (0, 1), (0, -1))):
                        cut.append((x, y))
        for x, y in cut:
            px[x, y] = (0, 0, 0, 0)
    return im


def cell(im, c, r, cols, rows, pad=3):
    w, h = im.size; cw, ch = w / cols, h / rows
    return im.crop((int(c * cw) + pad, int(r * ch) + pad, int((c + 1) * cw) - pad, int((r + 1) * ch) - pad))


def trim(im):
    bb = im.getchannel("A").point(lambda v: 255 if v > 40 else 0).getbbox()
    return im.crop(bb) if bb else im


def finish(im, size):
    # LANCZOS geeft de mooiste verkleining; daarna harde alpha en een klein palet
    a = im.getchannel("A").point(lambda v: 255 if v >= 128 else 0)
    rgb = im.convert("RGB")
    if BOOST:
        from PIL import ImageEnhance
        rgb = ImageEnhance.Contrast(ImageEnhance.Color(rgb).enhance(1.35)).enhance(1.18)
        rgb = ImageEnhance.Brightness(rgb).enhance(1.12)
    if PALET:
        rgb = rgb.quantize(colors=PALET, method=Image.FASTOCTREE, dither=Image.NONE).convert("RGB")
    out = rgb.convert("RGBA"); out.putalpha(a)
    return out


def premult_resize(im, w, h):
    # verkleinen met gemiddelde (BOX) over alleen de zichtbare pixels, zodat de randen niet donker of roze uitlopen
    r, g, b, a = im.split()
    from PIL import ImageChops
    pm = Image.merge("RGB", [ImageChops.multiply(c, a) for c in (r, g, b)])
    pm = pm.resize((w, h), Image.BOX); a2 = a.resize((w, h), Image.BOX)
    px, ap = pm.load(), a2.load(); out = Image.new("RGBA", (w, h)); op = out.load()
    for y in range(h):
        for x in range(w):
            al = ap[x, y]
            if al < 8: op[x, y] = (0, 0, 0, 0)
            else: op[x, y] = tuple(min(255, round(c * 255 / al)) for c in px[x, y]) + (al,)
    return out


def place(frame, scale, size, baseline_pad=2, center=True):
    w, h = max(1, round(frame.width * scale)), max(1, round(frame.height * scale))
    if w > size: s2 = size / w; w, h = size, max(1, round(h * s2))
    if h > size: s2 = size / h; h, w = size, max(1, round(w * s2))
    sp = finish(premult_resize(frame, w, h), size)
    canvas = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    x = (size - w) // 2 if center else 0
    canvas.alpha_composite(sp, (x, size - baseline_pad - h if h < size - baseline_pad else size - h))
    return canvas


def slice_sheet_a(im, fid, out):
    frames = []
    for i, name in enumerate(TD_NAMES):
        c, r = i % 3, i // 3
        frames.append((name, trim(key(cell(im, c, r, 3, 2)))))
    idle_h = frames[0][1].height
    size = SIZES["td"]; scale = (size - 5*size/48) / idle_h          # rust: 43 px hoog in 48 (evenredig bij 96: 86 px)
    res = []
    for name, fr in frames:
        spr = place(fr, scale, size, baseline_pad=max(2, 2*size//48)); spr.save(os.path.join(out, f"{fid}_td_{name}.png")); res.append(spr)
        if name == "idle": spr.save(os.path.join(out, f"{fid}_td.png"))
    return res


def slice_sheet_b(im, fid, out):
    res = []
    spec = [("portrait", SIZES["portrait"], 0), ("battle_front", SIZES["battle"], 1), ("battle_back", SIZES["battle"], 2)]
    frames = [trim(key(cell(im, i, 0, 3, 1))) for i in range(3)]
    for (name, size, i), fr in zip(spec, frames):
        if name == "portrait":
            scale = min(size / fr.width, size / fr.height); spr = place(fr, scale * 0.96, size, baseline_pad=4)
        else:
            scale = (size - 6*size/96) / max(frames[1].height, frames[2].height); spr = place(fr, scale, size, baseline_pad=max(3, 3*size//96))
        spr.save(os.path.join(out, f"{fid}_{name}.png")); res.append(spr)
    return res


def slice_portrait(im, fid, out):
    fr = trim(key(im)); size = SIZES["portrait"]
    scale = min(size / fr.width, size / fr.height) * 0.96
    spr = place(fr, scale, size, baseline_pad=4); spr.save(os.path.join(out, f"{fid}_portrait.png")); return [spr]


def preview(sprites, path, S=6):
    w = sum(s.width * S + 8 for s in sprites) + 8; h = max(s.height for s in sprites) * S + 16
    sheet = Image.new("RGBA", (w, h), (40, 34, 28, 255)); x = 8
    for s in sprites:
        sheet.alpha_composite(s.resize((s.width * S, s.height * S), Image.NEAREST), (x, 8)); x += s.width * S + 8
    sheet.save(path)


def main():
    global BOOST
    args = [a for a in sys.argv[1:] if a != "--boost"]; BOOST = "--boost" in sys.argv
    if len(args) < 3:
        print(__doc__); sys.exit(1)
    src, fid, kind = args[0], args[1], args[2].lower()
    out = args[3] if len(args) > 3 else "."
    os.makedirs(out, exist_ok=True)
    im = Image.open(src).convert("RGB")
    f = {"a": slice_sheet_a, "b": slice_sheet_b, "portrait": slice_portrait}.get(kind)
    if not f: print("onbekend type:", kind); sys.exit(1)
    sprites = f(im, fid, out)
    preview(sprites, os.path.join(out, f"{fid}_preview_{kind}.png"))
    print(f"{len(sprites)} sprite(s) geschreven naar {out}")


if __name__ == "__main__":
    main()
