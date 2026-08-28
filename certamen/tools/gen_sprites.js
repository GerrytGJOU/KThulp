/* gen_sprites.js — genereert de afgeleide avatar-sprites voor Battle Mode /
   Chronica Classica uit één bronbestand: assets/sprites/base_light.png.

   Waarom een generator en geen handwerk: base_dark.png bleek een exacte
   palet-omwisseling van base_light.png te zijn (6 huidkleuren, al het andere
   byte-identiek). Daardoor is elke tussenliggende huidtint pixelperfect uit te
   rekenen in plaats van te tekenen, en geldt hetzelfde voor de oogkleuren
   (de iris is 2 vaste kleuren) en de borstband (het enige echte verschil
   tussen base_light.png en base_light_female.png).

   Draaien vanuit certamen/:  node tools/gen_sprites.js
   Daarna SPRITE_VER in battle.js ophogen.
*/
const fs = require("fs"), zlib = require("zlib"), path = require("path");
const DIR = path.join(__dirname, "..", "assets", "sprites");

/* ---- minimale PNG in/uit (8-bit RGBA) ---- */
function decode(file){
  const b = fs.readFileSync(file); let p = 8, idat = [], w, h;
  while(p < b.length){
    const len = b.readUInt32BE(p), type = b.toString("ascii", p+4, p+8);
    if(type === "IHDR"){ w = b.readUInt32BE(p+8); h = b.readUInt32BE(p+12); }
    if(type === "IDAT") idat.push(b.slice(p+8, p+8+len));
    p += 12 + len;
  }
  const raw = zlib.inflateSync(Buffer.concat(idat));
  const out = Buffer.alloc(w*h*4), stride = w*4, bpp = 4; let o = 0;
  for(let y=0; y<h; y++){
    const ft = raw[o++], line = raw.slice(o, o+stride); o += stride;
    const cur = out.slice(y*stride, (y+1)*stride);
    const prev = y>0 ? out.slice((y-1)*stride, y*stride) : Buffer.alloc(stride);
    for(let x=0; x<stride; x++){
      const a = x>=bpp?cur[x-bpp]:0, b2 = prev[x], c = x>=bpp?prev[x-bpp]:0; let v = line[x];
      if(ft===1) v += a; else if(ft===2) v += b2; else if(ft===3) v += (a+b2)>>1;
      else if(ft===4){ const pp=a+b2-c, pa=Math.abs(pp-a), pb=Math.abs(pp-b2), pc=Math.abs(pp-c);
        v += (pa<=pb&&pa<=pc)?a:(pb<=pc?b2:c); }
      cur[x] = v & 255;
    }
  }
  return { w, h, data: out };
}
const CRC = (()=>{ const t=[]; for(let n=0;n<256;n++){ let c=n; for(let k=0;k<8;k++) c = c&1 ? 0xEDB88320^(c>>>1) : c>>>1; t[n]=c>>>0; } return t; })();
function crc32(buf){ let c = 0xFFFFFFFF; for(let i=0;i<buf.length;i++) c = CRC[(c^buf[i])&255]^(c>>>8); return (c^0xFFFFFFFF)>>>0; }
function chunk(type, data){
  const len = Buffer.alloc(4); len.writeUInt32BE(data.length);
  const td = Buffer.concat([Buffer.from(type,"ascii"), data]);
  const c = Buffer.alloc(4); c.writeUInt32BE(crc32(td));
  return Buffer.concat([len, td, c]);
}
function encode(file, w, h, data){
  const raw = Buffer.alloc(h*(w*4+1));
  for(let y=0; y<h; y++){ raw[y*(w*4+1)] = 0; data.copy(raw, y*(w*4+1)+1, y*w*4, (y+1)*w*4); }
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w,0); ihdr.writeUInt32BE(h,4); ihdr[8]=8; ihdr[9]=6;
  fs.writeFileSync(file, Buffer.concat([Buffer.from([137,80,78,71,13,10,26,10]),
    chunk("IHDR", ihdr), chunk("IDAT", zlib.deflateSync(raw, {level:9})), chunk("IEND", Buffer.alloc(0))]));
}

/* ---- paletten uit de bronsprites ---- */
// De 6 huidkleuren van base_light.png, van hooglicht naar diepste schaduw.
const HUID_LICHT = [[251,220,200],[249,193,157],[234,151,119],[179,103,57],[150,75,31],[97,53,24]];
// Dezelfde 6 in base_dark.png (exact dezelfde pixelposities).
const HUID_DONKER = [[150,109,82],[120,87,64],[80,49,34],[62,31,14],[43,20,8],[17,9,3]];
// De 2 iriskleuren (hooglicht + schaduw) van base_light.png.
const IRIS_BRON = [[104,184,255],[38,105,166]];
// Kleuren waaruit de borstband is opgebouwd in base_light_female.png.
const BAND_KLEUREN = new Set(["0,0,0","32,29,26","58,48,44","79,65,60","112,91,84","136,129,100"]);

const clamp = v => Math.max(0, Math.min(255, Math.round(v)));
const lerp = (a, b, t) => a.map((c, i) => clamp(c + (b[i]-c)*t));

// De zes huidtinten. "licht" en "donker" zijn per definitie identiek aan de
// bestaande sprites, zodat bestaande profielen er niet anders uit gaan zien.
const HUIDTINTEN = {
  // Lichter dan "licht": naar wit toe, met een aflopende factor zodat de
  // schaduwen niet vervlakken.
  zeerlicht: HUID_LICHT.map((c,i) => { const f = [0.26,0.22,0.18,0.15,0.13,0.11][i];
                                       return c.map(v => clamp(v + (255-v)*f)); }),
  licht:     HUID_LICHT,
  getint:    HUID_LICHT.map((c,i) => lerp(c, HUID_DONKER[i], 0.28)),
  // Olijf: zelfde positie op de ladder als "getint"+ maar iets groener/geler
  // (minder rood, iets meer groen) zodat de reeks niet louter donkerder wordt.
  olijf:     HUID_LICHT.map((c,i) => { const m = lerp(c, HUID_DONKER[i], 0.44);
                                       return [clamp(m[0]*0.97), m[1], clamp(m[2]*0.90)]; }),
  brons:     HUID_LICHT.map((c,i) => lerp(c, HUID_DONKER[i], 0.70)),
  donker:    HUID_DONKER,
};

// Oogkleuren: [hooglicht, schaduw] — vervangen de twee iriskleuren.
const OOGKLEUREN = {
  blauw:       [[104,184,255],[38,105,166]],
  bruin:       [[156,102,54], [92,54,24]],
  donkerbruin: [[104,66,38],  [54,32,16]],
  groen:       [[106,180,96], [46,104,52]],
  grijs:       [[170,182,188],[92,106,116]],
  amber:       [[222,158,58], [138,86,22]],
};

/* ---- generatie ---- */
const src  = decode(path.join(DIR, "base_light.png"));
const fem  = decode(path.join(DIR, "base_light_female.png"));
const key  = (d,i) => d.data[i+3]===0 ? null : d.data[i]+","+d.data[i+1]+","+d.data[i+2];
const W = src.w, H = src.h;

const huidIndex = new Map(HUID_LICHT.map((c,i) => [c.join(","), i]));
const irisIndex = new Map(IRIS_BRON.map((c,i) => [c.join(","), i]));

// 1. Zes lichamen: alleen de 6 huidkleuren omwisselen, al het andere ongemoeid.
for(const [naam, ramp] of Object.entries(HUIDTINTEN)){
  const out = Buffer.from(src.data);
  for(let i=0; i<out.length; i+=4){
    const k = key(src, i); if(k === null) continue;
    const idx = huidIndex.get(k); if(idx === undefined) continue;
    out[i] = ramp[idx][0]; out[i+1] = ramp[idx][1]; out[i+2] = ramp[idx][2];
  }
  encode(path.join(DIR, `base_${naam}.png`), W, H, out);
}

// 2. Zes ooglagen: alleen de irispixels, in de gevraagde kleur.
for(const [naam, paar] of Object.entries(OOGKLEUREN)){
  const out = Buffer.alloc(W*H*4);
  for(let i=0; i<out.length; i+=4){
    const k = key(src, i); if(k === null) continue;
    const idx = irisIndex.get(k); if(idx === undefined) continue;
    out[i] = paar[idx][0]; out[i+1] = paar[idx][1]; out[i+2] = paar[idx][2]; out[i+3] = 255;
  }
  encode(path.join(DIR, `ogen_${naam}.png`), W, H, out);
}

// 3. Borstband: de pixels waarin base_light_female.png van base_light.png
//    verschilt én die tot het bandpalet horen. De eis "man is hier huid" houdt
//    losse randpixels buiten de deur in de negen frames waarin de vrouwelijke
//    tekening een fractie verschoven staat.
{
  const out = Buffer.alloc(W*H*4); let n = 0;
  for(let i=0; i<out.length; i+=4){
    const mk = key(src, i), fk = key(fem, i);
    if(fk === null || mk === null || mk === fk) continue;
    if(!BAND_KLEUREN.has(fk)) continue;
    if(!huidIndex.has(mk)) continue;
    out[i] = fem.data[i]; out[i+1] = fem.data[i+1]; out[i+2] = fem.data[i+2]; out[i+3] = 255; n++;
  }
  encode(path.join(DIR, "borstband.png"), W, H, out);
  console.log("borstband: " + n + " pixels");
}
console.log("klaar: " + Object.keys(HUIDTINTEN).length + " lichamen, "
          + Object.keys(OOGKLEUREN).length + " ooglagen, 1 borstband");
