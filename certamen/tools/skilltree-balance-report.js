#!/usr/bin/env node
// Vat tools/skilltree-balance-result.json samen (zie skilltree-balance.js).
const fs=require("fs"),path=require("path"),vm=require("vm");
const R=JSON.parse(fs.readFileSync(path.join(__dirname,"skilltree-balance-result.json"),"utf8"));
const ctx={};vm.createContext(ctx);vm.runInContext(fs.readFileSync(path.join(__dirname,"..","skilltree-data.js"),"utf8"),ctx);
const T=vm.runInContext("BM_SKILLTREES",ctx);
// SC = scenario's die meetellen in de mediaan; SCX = ook tonen (met achterstand apart)
const SC=["bm","hydra","cyclops","minotaur"], SCX=["bm","bmAchter","hydra","cyclops","minotaur"];
const SCN={bm:"Battle Mode",bmAchter:"BM met achterstand",hydra:"Hydra",cyclops:"Cycloop",minotaur:"Minotaurus"};
const pct=(v,b)=>((v/b-1)*100);
const fmt=v=>(v>=0?"+":"")+v.toFixed(0)+"%";
const med=a=>{const s=[...a].sort((x,y)=>x-y);return s[Math.floor(s.length/2)];};
const lines=[]; const P=s=>lines.push(s);
P("# Balanstest skill-trees ("+R.generated.slice(0,10)+", "+R.K+" gevechten per opbouw per scenario)\n");
P("Omgeving: teamgenoten en tegenstanders "+(R.context==="oud"?"allemaal nu ★10":"met een willekeurige skill-tree")+". Bijdrage per ronde in HP-waarde, t.o.v. dezelfde klasse zoals hij nu op ★10 speelt. Mediaan = typische opbouw, Beste = sterkste van de 32 (hybride 96) opbouwen. \"BM met achterstand\" = Battle Mode waarin het eigen leger op 60% HP begint (telt niet mee in de mediaan).\n");
const pathRows=[];
const avgSc=(r,base)=>SC.reduce((a,s)=>a+pct(r[s].perRound,base[s].perRound),0)/SC.length;
for(const c in R.classes){
  const {base,rows}=R.classes[c]; const t=T[c];
  P("## "+t.nm);
  P("| Pad | "+SCX.map(s=>SCN[s]+" (med / beste)").join(" | ")+" |");
  P("|---|"+SCX.map(()=>"---").join("|")+"|");
  P("| _nu ★10 (HP/ronde)_ | "+SCX.map(s=>base[s].perRound.toFixed(1)).join(" | ")+" |");
  for(const p of ["A","H","B"]){
    const rs=rows.filter(r=>r.path===p);
    const cells=SCX.map(s=>{const v=rs.map(r=>pct(r[s].perRound,base[s].perRound));return fmt(med(v))+" / "+fmt(Math.max(...v));});
    const all=rs.map(r=>avgSc(r,base));
    const boss=r=>(pct(r.hydra.perRound,base.hydra.perRound)+pct(r.cyclops.perRound,base.cyclops.perRound)+pct(r.minotaur.perRound,base.minotaur.perRound))/3;
    pathRows.push({cls:t.nm,path:t.paths[p].nm,med:med(all),best:Math.max(...all),
      bm:med(rs.map(r=>pct(r.bm.perRound,base.bm.perRound))),achter:med(rs.map(r=>pct(r.bmAchter.perRound,base.bmAchter.perRound))),boss:med(rs.map(boss))});
    P("| "+t.paths[p].nm+" | "+cells.join(" | ")+" |");
  }
  const eff=[];
  for(const p of ["A","B"]) for(const row of t.pathNodes[p]){
    const rs=rows.filter(r=>r.path===p);
    const avg=id=>{const x=rs.filter(r=>r.nodes.includes(id));return x.reduce((a,r)=>a+avgSc(r,base),0)/x.length;};
    eff.push({star:row.star,p:t.paths[p].nm,a:row.a.nm,b:row.b.nm,diff:avg(row.a.id)-avg(row.b.id)});
  }
  const pres=t.prestige.map(v=>{const x=rows.filter(r=>r.prestige===v.id);return {nm:v.nm,v:x.reduce((a,r)=>a+avgSc(r,base),0)/x.length};});
  const big=eff.filter(e=>Math.abs(e.diff)>=6).sort((x,y)=>Math.abs(y.diff)-Math.abs(x.diff));
  P("");
  P("Prestige-varianten (gem. over alle opbouwen): "+pres.map(x=>x.nm+" "+fmt(x.v)).join(" · "));
  if(big.length) P("Scheve keuzes (≥6 procentpunt verschil tussen a en b): "+big.map(e=>"★"+e.star+" "+e.p+": "+(e.diff>0?e.a+" > "+e.b:e.b+" > "+e.a)+" ("+Math.abs(e.diff).toFixed(0)+" pp)").join(" · "));
  P("");
}
P("## Alle 24 paden naast elkaar (mediaan over Battle Mode + de 3 bazen)\n");
P("| Klasse | Pad | Mediaan | Beste | Battle Mode | BM met achterstand | Bazen |");
P("|---|---|---|---|---|---|---|");
pathRows.sort((a,b)=>b.med-a.med).forEach(r=>P("| "+r.cls+" | "+r.path+" | "+fmt(r.med)+" | "+fmt(r.best)+" | "+fmt(r.bm)+" | "+fmt(r.achter)+" | "+fmt(r.boss)+" |"));
const meds=pathRows.map(r=>r.med); P("\nSpreiding mediaan: "+fmt(Math.min(...meds))+" … "+fmt(Math.max(...meds))+"\n");
P("## Winkansen tegen bazen — hele klas (8, één per klasse)\n");
P("\"+schaal\" = baas-HP ×(1 + "+R.hpPerStar+" × gemiddelde ster) én baasklap ×(1 + "+R.atkPerStar+" × gemiddelde ster). Per cel: winst / gem. rondes.\n");
const modes=Object.keys(Object.values(R.bossWin)[0]);
P("| Baas | Moeilijkheid | Goed | "+modes.join(" | ")+" |");
P("|---|---|---|"+modes.map(()=>"---").join("|")+"|");
for(const k in R.bossWin){const [b,d,a]=k.split("|");const v=R.bossWin[k];P("| "+SCN[b]+" | "+d+" | "+Math.round(a*100)+"% | "+modes.map(m=>Math.round(v[m].win*100)+"% / "+v[m].rounds.toFixed(0)).join(" | ")+" |");}
P("\nBattle Mode, hele klas skill-trees tegen hele klas nu ★10: skill-trees winnen "+Math.round(R.bmTreeVsOld*100)+"%.");
if(R.monoTeams){
  P("\n## Teams van één soort tegen bazen (8 × dezelfde klasse en hetzelfde pad, 75% goed, mét baas-schaal)\n");
  const ks=Object.keys(Object.values(R.monoTeams)[0]);
  P("| Team | "+ks.map(k=>{const [b,d]=k.split("|");return SCN[b]+" "+d;}).join(" | ")+" |");
  P("|---|"+ks.map(()=>"---").join("|")+"|");
  const ord=Object.keys(R.monoTeams).sort((a,b)=>a.startsWith("Gemengd")?-1:b.startsWith("Gemengd")?1:
    ks.reduce((s,k)=>s+R.monoTeams[b][k].win,0)-ks.reduce((s,k)=>s+R.monoTeams[a][k].win,0));
  for(const nm of ord) P("| "+nm+" | "+ks.map(k=>Math.round(R.monoTeams[nm][k].win*100)+"% / "+R.monoTeams[nm][k].rounds.toFixed(0)).join(" | ")+" |");
}
fs.writeFileSync(path.join(__dirname,"skilltree-balance-report.md"),lines.join("\n"));
console.log(lines.join("\n"));
