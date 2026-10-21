"""gen_sprites_topdown.py — afgeleide TOP-DOWN avatar-sprites (Castra Heronum).

Tegenhanger van tools/gen_sprites.js (battler). Bron: assets/sprites-topdown/
TV_Body_p01.png (RPG Maker MV-lichaam, zelfde 6 huidkleuren en irispixels als
base_light.png). Genereert base_<huidtint>.png (6x) en ogen_<kleur>.png (6x) met
EXACT dezelfde paletten als gen_sprites.js -> houd beide scripts gelijk.

Draaien vanuit certamen/:  python tools/gen_sprites_topdown.py
Daarna CASTRA_SPRITE_VER in castra-avatar.js ophogen.
"""
from PIL import Image
import os
D = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "assets", "sprites-topdown")
clamp = lambda v: max(0, min(255, round(v)))
lerp = lambda a, b, t: tuple(clamp(c + (b[i]-c)*t) for i, c in enumerate(a))
HUID_LICHT  = [(251,220,200),(249,193,157),(234,151,119),(179,103,57),(150,75,31),(97,53,24)]
HUID_DONKER = [(150,109,82),(120,87,64),(80,49,34),(62,31,14),(43,20,8),(17,9,3)]
F = [0.26,0.22,0.18,0.15,0.13,0.11]
def olijf(i):
    m = lerp(HUID_LICHT[i], HUID_DONKER[i], 0.44); return (clamp(m[0]*0.97), m[1], clamp(m[2]*0.90))
TINTEN = {
  "zeerlicht": [tuple(clamp(v+(255-v)*F[i]) for v in c) for i, c in enumerate(HUID_LICHT)],
  "licht":     HUID_LICHT,
  "getint":    [lerp(c, HUID_DONKER[i], 0.28) for i, c in enumerate(HUID_LICHT)],
  "olijf":     [olijf(i) for i in range(6)],
  "brons":     [lerp(c, HUID_DONKER[i], 0.70) for i, c in enumerate(HUID_LICHT)],
  "donker":    HUID_DONKER,
}
IRIS_BRON = [(104,184,255),(38,105,166)]
OGEN = {
  "blauw": [(104,184,255),(38,105,166)], "bruin": [(156,102,54),(92,54,24)],
  "donkerbruin": [(104,66,38),(54,32,16)], "groen": [(106,180,96),(46,104,52)],
  "grijs": [(170,182,188),(92,106,116)], "amber": [(222,158,58),(138,86,22)],
}
src = Image.open(os.path.join(D, "TV_Body_p01.png")).convert("RGBA")
W, H = src.size
huid = {c: i for i, c in enumerate(HUID_LICHT)}
iris = {c: i for i, c in enumerate(IRIS_BRON)}
for naam, ramp in TINTEN.items():
    out = src.copy(); px = out.load()
    for y in range(H):
        for x in range(W):
            r, g, b, a = px[x, y]
            if a and (r,g,b) in huid: px[x, y] = (*ramp[huid[(r,g,b)]], a)
    out.save(os.path.join(D, f"base_{naam}.png"))
for naam, paar in OGEN.items():
    out = Image.new("RGBA", (W, H), (0,0,0,0)); px = out.load(); sp = src.load()
    for y in range(H):
        for x in range(W):
            r, g, b, a = sp[x, y]
            if a and (r,g,b) in iris: px[x, y] = (*paar[iris[(r,g,b)]], 255)
    out.save(os.path.join(D, f"ogen_{naam}.png"))
print("klaar: 6 huidtinten + 6 oogkleuren")
