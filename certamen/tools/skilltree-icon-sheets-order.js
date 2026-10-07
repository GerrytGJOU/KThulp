// Volgorde van de iconen per vel (gedeeld door skilltree-icon-sheets.js en
// skilltree-icon-slice.py): 1 = identiteit, 2 = pad A, 3 = pad B, 4 = kern.
// Klasse "fix" = verbetervellen: losse iconen uit alle bomen die opnieuw
// moesten. fix_1 (Gemini) en fix_2 (ChatGPT) = FIX_ICONS, fix_3 = FIX_ICONS_3.
const FIX_ICONS=[
  "genie_root.png","hopliet_marathon.png","cavalerie_charge_van_alexander.png","cavalerie_numidische_storm.png",
  "verkenner_arminius.png","verkenner_kleine_steken.png","verkenner_woudgeest.png","verkenner_varus_ondergang.png",
  "priester_raadselspreuk.png","cavalerie_parthisch_schot.png","centurio_niemand_valt.png","priester_epidauros.png",
];
const FIX_ICONS_3=[
  "boogschutter_vaste_hand.png","boogschutter_koelbloedig.png","boogschutter_meesterschutter.png","hopliet_gedrilde_rijen.png",
  "hopliet_taai_als_brons.png","hopliet_laatste_bolwerk.png","hopliet_opmars.png","spartaan_levensroof.png",
  "spartaan_dorst.png","spartaan_brandend_bloed.png","priester_les_van_delphi.png",
  "priester_orakel_van_delphi.png","centurio_root.png","centurio_signum.png","verkenner_infiltrant.png",
];
// fix_4: de twee uit fix_3 die nog niet goed waren, met een uitgebreidere prompt.
const FIX_ICONS_4=["priester_les_van_delphi.png","centurio_root.png"];
// fix_5: de vier nieuwe Priester-knooppunten (Ambrosia, Zegenstroom, Lichtmantel, Gemeenschap).
const FIX_ICONS_5=["priester_ambrosia.png","priester_zegenstroom.png","priester_lichtmantel.png","priester_gemeenschap.png"];
// fix_6: de negen nieuwe knooppunten uit het pakket "minder platte klassen" (2026-10-07).
const FIX_ICONS_6=["hopliet_herstelde_linie.png","boogschutter_verlammende_pijl.png","cavalerie_koerierdienst.png","cavalerie_schokgolf.png","spartaan_heldenschild.png","centurio_aanvalsbevel.png","centurio_victoria.png","boogschutter_scherpe_concentratie.png","boogschutter_havikoog.png"];
const fixList=key=>key==="6"?FIX_ICONS_6:key==="5"?FIX_ICONS_5:key==="4"?FIX_ICONS_4:key==="3"?FIX_ICONS_3:FIX_ICONS;
// Zoekt een knooppunt op bestandsnaam, met de tegelkleur die erbij hoort.
function findIcon(TREES,icon){
  for(const t of Object.values(TREES)){
    const P=t.paths, hit=(n,acc)=>n.icon===icon?{n,acc,t}:null;
    let r=hit(t.root,t.colorNm)||hit(t.master,"warm gold");
    for(const s of t.identity){ r=r||hit(s.A,P.A.accentNm)||hit(s.B,P.B.accentNm); }
    for(const k of ["A","B"]) for(const s of t.pathNodes[k]){ r=r||hit(s.a,P[k].accentNm)||hit(s.b,P[k].accentNm); }
    for(const p of t.prestige){ r=r||hit(p,P[p.path].accentNm+" with extra gold"); }
    if(r) return r;
  }
  throw new Error("icoon niet gevonden: "+icon);
}
module.exports=function(TREES,cls,key){
  const n=x=>({nm:x.nm,icon:x.icon});
  if(cls==="fix") return fixList(key).map(i=>n(findIcon(TREES,i).n));
  const t=TREES[cls];
  if(key==="1") return t.identity.flatMap(s=>[n(s.A),n(s.B)]);
  if(key==="2") return t.pathNodes.A.flatMap(s=>[n(s.a),n(s.b)]);
  if(key==="3") return t.pathNodes.B.flatMap(s=>[n(s.a),n(s.b)]);
  return [n(t.root),n(t.master),...t.prestige.map(n)];
};
module.exports.FIX_ICONS=FIX_ICONS;
module.exports.fixList=fixList;
module.exports.findIcon=findIcon;
