// Volgorde van de iconen per vel (gedeeld door skilltree-icon-sheets.js en
// skilltree-icon-slice.py): 1 = identiteit, 2 = pad A, 3 = pad B, 4 = kern.
module.exports=function(TREES,cls,key){
  const t=TREES[cls], n=x=>({nm:x.nm,icon:x.icon});
  if(key==="1") return t.identity.flatMap(s=>[n(s.A),n(s.B)]);
  if(key==="2") return t.pathNodes.A.flatMap(s=>[n(s.a),n(s.b)]);
  if(key==="3") return t.pathNodes.B.flatMap(s=>[n(s.a),n(s.b)]);
  return [n(t.root),n(t.master),...t.prestige.map(n)];
};
