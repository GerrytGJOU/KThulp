/* ============================================================================
   CASTRA HEROUM — BIOMEN PER REGIO
   ----------------------------------------------------------------------------
   Elke regio krijgt een eigen landschap, zonder nieuwe kaartlogica: ondergrond-
   vlekken, boomsoort en -dichtheid, decor (cactussen, paddenstoelen, rotsen,
   droog gras, ...) en het uiterlijk van het hoge gras (ontmoetingstegels).
   Het kaartgenerator-deel staat in castraWorldDef (castra-world.js, W.biome);
   de objecten staan in castra-map.js.
   Laadt NA castra-regions.js (voor de eerste kaartopbouw).
   ============================================================================ */
const CASTRA_BIOMES = {
  // Latium en Roma blijven het standaardlandschap (Middellandse-Zeegebied): geen eigen bioom, zodat bewaarde posities geldig blijven.
  // Gallia: loofbos met paddenstoelen en boomstronken
  gallia:     { sparse:0.13, dense:0.32, decor:["mush_b","mush_r","stump_g","fern_big","flower_w","flower_p","plant_a","plant_b","stones","logs"], decorP:0.09, tallPieces:["fern_big","plant_c"] },
  // Germania: dicht naaldbos, vallende bladeren, stronken en boomstammen
  germania:   { sparse:0.18, dense:0.42, decor:["mush_b","mush_r","stump_g","logs","fern_big","leaves","stones","plant_b","fern","rock_grey"], decorP:0.11, tallPieces:["fern_big","fern"] },
  // Themiscyra: bossen en bloeiende weiden
  themiscyra: { sparse:0.10, dense:0.30, decor:["flower_p","flower_w","flower_b","bush_pink","mush_r","fern_big","plant_a","stump_g"], decorP:0.11 },
  // Graecia: kale, zonnige heuvels met olijfstruiken
  graecia:    { patch:{ g:"sand", thr:0.64, cell:6 }, decor:["bush_pink","dry_grass","rock_brown","stones","flower_w","flower_p","plant_a"], decorP:0.08 },
  // Laconia: rotsachtig bergland
  laconia:    { patch:{ g:"cobble", thr:0.64, cell:5 }, decor:["rock_brown","rock_grey","stones","dry_grass","bush_pink","dry_plant"], decorP:0.10, tallPieces:["dry_grass","plant_c"] },
  // Troia: kustvlakte met zand en droog gras
  troia:      { patch:{ g:"sand", thr:0.60, cell:6 }, decor:["dry_grass","stones","flower_w","plant_a","bush_pink","rock_brown","dry_plant"], decorP:0.08, zoneG:{ scamander:"grass" } },
  // Aegyptus: woestijn met een groene Nijlstrook
  aegyptus:   { trees:["palm","dead_a"], noBig:true, sparse:0.03, dense:0.20, patch:{ g:"sand", thr:0.58, cell:6 }, decor:["dry_grass","dry_plant","dry_fern","stones","rock_brown","cactus","leaves","hay"], decorP:0.10, tallGround:"sand", tallPieces:["dry_grass","dry_plant"], zoneG:{ nilus:"grass" } },
  // Africa: droge steppe en woestijn met cactussen
  africa:     { trees:["palm","palm2"], noBig:true, sparse:0.03, dense:0.10, patch:{ g:"sand", thr:0.55, cell:6 }, decor:["cactus","dry_grass","dry_plant","dry_fern","stones","rock_brown","cactus","leaves"], decorP:0.11, tallGround:"sand", tallPieces:["dry_grass","dry_fern"] },
  // Persis: dor bergland met dode bomen en rotsen
  persis:     { trees:["palm","dead_b"], noBig:true, sparse:0.05, dense:0.10, patch:{ g:"cobble", thr:0.60, cell:5 }, decor:["rock_brown","rock_grey","stones","dry_grass","dry_plant","dry_fern","cactus"], decorP:0.11, tallGround:"sand", tallPieces:["dry_grass","dry_plant"] },
};
Object.keys(CASTRA_BIOMES).forEach(rid=>{
  const W = CASTRA_WORLDS[rid], B = CASTRA_BIOMES[rid]; if(!W) return;
  W.biome = B;
  if(B.trees) W.trees = B.trees;
  if(B.sparse!==undefined) W.sparse = B.sparse;
  if(B.dense!==undefined) W.dense = B.dense;
  if(B.zoneG) W.zones.forEach(z=>{ if(B.zoneG[z.t]) z.g = B.zoneG[z.t]; });
});
