# Herkleurt een uitgesneden skill-icoon: tinten binnen [h_lo,h_hi] (graden) naar
# een doeltint, optioneel met verzadigingsfactor (>1 maakt ook iets lichter).
# Gebruik: python tools/skilltree-icon-recolor.py assets/skills/x.png 90 170 175 [0.65]
# (Cavalerie vel 1: Gemini wisselde twee padkleuren om, zie de commit.)
from PIL import Image
# recolor.py file h_lo h_hi target_hue  : hues binnen [lo,hi] → target (graden)
f, lo, hi, tgt = sys.argv[1], *map(float, sys.argv[2:5]); sk = float(sys.argv[5]) if len(sys.argv)>5 else 1.0
im = Image.open(f).convert("RGBA"); px = im.load()
for y in range(im.size[1]):
    for x in range(im.size[0]):
        r,g,b,a = px[x,y]
        if not a: continue
        h,s,v = colorsys.rgb_to_hsv(r/255,g/255,b/255); hd = h*360
        if s > 0.12 and (lo <= hd <= hi if lo <= hi else (hd >= lo or hd <= hi)):
            r2,g2,b2 = colorsys.hsv_to_rgb(tgt/360, min(1,s*sk), v*(1.0 if sk<=1 else 1.25) if v*(1.0 if sk<=1 else 1.25)<1 else 1)
            px[x,y] = (round(r2*255), round(g2*255), round(b2*255), a)
im.save(f)
