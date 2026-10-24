/* ============================================================================
   CASTRA HEROUM — LEVENSPUNTEN BLIJVEN NA HET GEVECHT (zoals in Pokémon)
   ----------------------------------------------------------------------------
   Een soldaat of held begon elk jachtgevecht met vol leven. Nu houdt hij wat hij verloren heeft: na het gevecht staat zijn leven op wat er
   over was (ook als je soldaat wisselde of de vijand gevangen werd). Wie omvalt is een tijd buiten gevecht (soldaat: de bekende
   gewond-timer, held: enkele minuten) en komt terug met een kwart van zijn leven. Herstel:
     - een beetje vanzelf, in echte tijd (CASTRA_HP.regenPerMin van het maximum per minuut);
     - helemaal bij de put, het Hospitium, de rustplekken in de landen, het altaar (veldactie) en bij de genezer van het Valetudinarium.
   De dux vecht altijd met vol leven. Een gevangen vijand sluit zich aan met het leven dat hij op dat moment had.
   Opslag: soldaat.hpf / held.hpf = fractie van het maximum (ontbreekt = vol), hpt = tijdstip waarop die fractie gold. Alleen als er iets
   ontbreekt, zodat de save klein blijft.
   Laadt NA castra-party.js (haakt in het resultaatscherm en de reservekeuze).
   ============================================================================ */
const CASTRA_HP = { regenPerMin:0.005, faintFrac:0.25, heroDownMin:5 };

function castraHpRec(u){ if(!u || u.dux) return null; return u.hero ? u.h : u; }
// Is dit een eenheid van de speler (soldaat in het kamp of held)? Vijanden en proefeenheden slaan we niet op.
function castraHpOwned(u){ const h = castraHpRec(u); if(!h) return false; if(u.hero) return true; return (CASTRA.soldiers||[]).some(s=>s===h || s.id===h.id); }
// Huidige fractie van het maximum (0..1), inclusief het vanzelf herstellen.
function castraHpf(u){
  const h = castraHpRec(u); if(!h) return 1;
  if(!u.hero && typeof castraIsHurt==="function" && castraIsHurt(h)) return 0;       // gewond: buiten gevecht
  if(h.hpf==null) return 1;
  const now = castraNow(), t = Math.max(h.hpt||0, h.hurtUntil||0); if(t>now) return 0;
  return Math.min(1, h.hpf + (now-t)/60000*CASTRA_HP.regenPerMin);
}
// Zet het leven na (een deel van) een gevecht. frac 0 = omgevallen.
function castraHpSet(u, frac){
  const h = castraHpRec(u); if(!h || !castraHpOwned(u)) return;
  const now = castraNow();
  if(frac>=0.999){ delete h.hpf; delete h.hpt; return; }
  if(frac<=0){ h.hpf = CASTRA_HP.faintFrac; h.hpt = u.hero ? now + CASTRA_HP.heroDownMin*60000 : now; return; }   // soldaat: de gewond-timer bepaalt hoe lang
  h.hpf = Math.round(frac*1000)/1000; h.hpt = now;
}
// Een gevangen vijand neemt zijn leven mee.
function castraHpCarry(unit, frac){ if(frac>=0.999){ delete unit.hpf; delete unit.hpt; } else { unit.hpf = Math.max(0.05, Math.round(frac*1000)/1000); unit.hpt = castraNow(); } }
function castraHpStore(V){
  if(!V || !V.s || !V.s.me) return;
  const S = V.s.me; if(!S.unit || S.unit.dux) return;
  castraHpSet(S.unit, S.hp<=0 ? 0 : S.hp/Math.max(1, S.max));
}
// Wie heeft genezing nodig (gewond of niet vol)?
function castraNeedHeal(){
  const out = [];
  (CASTRA.soldiers||[]).forEach(s=>{ if(castraIsHurt(s) || castraHpf(s)<0.999) out.push(s); });
  (CASTRA.heroes||[]).forEach(h=>{ if(castraHpf({ hero:true, h })<0.999) out.push(h); });
  return out;
}
function castraHealAll(){
  const list = castraNeedHeal();
  (CASTRA.soldiers||[]).forEach(s=>{ s.hurtUntil = 0; delete s.hpf; delete s.hpt; });
  (CASTRA.heroes||[]).forEach(h=>{ delete h.hpf; delete h.hpt; });
  castraSave(); return list;
}
// Een soldaat meteen genezen (genezer van het Valetudinarium).
function castraHealOne(s){ s.hurtUntil = 0; delete s.hpf; delete s.hpt; }

/* ---------- weergave ---------- */
function castraHpHTML(u, w){
  const f = castraHpf(u), p = Math.round(f*100), col = p>50 ? "#3f9d52" : p>20 ? "#d4a017" : "#c8392a";
  const down = f<=0 ? " · buiten gevecht" : "";
  return `<span title="Levenspunten ${p}%${down}" style="display:inline-flex;align-items:center;gap:5px;font-size:12px;opacity:.9"><span style="display:inline-block;width:${w||56}px;height:7px;background:#1b150e;border:1px solid #4a3d2c;border-radius:4px;overflow:hidden"><i style="display:block;width:${p}%;height:100%;background:${col}"></i></span>${p}%${down}</span>`;
}

/* ---------- haken ---------- */
// Na elke beurt het leven van je soldaat bewaren (ook bij wisselen en omvallen).
const _castraMvRoundHp0 = castraMvRound;
castraMvRound = function(V, mine){ const r = _castraMvRoundHp0.apply(this, arguments); try{ castraHpStore(V); }catch(e){ console.error(e); } return r; };
// Het resultaat laat zien hoeveel leven je soldaat nog heeft.
const _castraVResultHp0 = castraVResultHTML;
castraVResultHTML = function(){
  let h = _castraVResultHp0.apply(this, arguments); const V = CASTRA_V;
  if(V && V.mine && !V.mine.dux && castraHpOwned(V.mine)){
    const name = typeof castraMvName==="function" ? castraMvName(V.mine) : "";
    h = h.replace(/(<div style="display:flex;gap:10px;margin-top:14px">)/, `<div class="note" style="margin-top:8px">❤️ ${esc(name)}: ${castraHpHTML(V.mine, 90)}${castraHpf(V.mine)<0.999 ? " <small>(genezen bij de put, het Hospitium of een rustplek)</small>" : ""}</div>$1`);
  }
  return h;
};
// Een vangst neemt het leven van de vijand mee.
const _castraVCatchTryHp0 = castraVCatchTry;
castraVCatchTry = function(k){
  const V = CASTRA_V; if(V && V.s && V.s.en && V.enemy) castraHpCarry(V.enemy, Math.max(0, V.s.en.hp)/Math.max(1, V.s.en.max));
  return _castraVCatchTryHp0.apply(this, arguments);
};
// Helden in het scoutscherm: leven tonen, en wie buiten gevecht is kun je niet sturen.
const _castraMvScoutHeroesHp0 = castraMvScoutHeroes;
castraMvScoutHeroes = function(){
  _castraMvScoutHeroesHp0.apply(this, arguments);
  (CASTRA.heroes||[]).forEach(h=>{
    const btn = [...document.querySelectorAll("#castraVBody button")].find(b=>(b.getAttribute("onclick")||"")==="castraVFight('hero_"+h.id+"')"); if(!btn) return;
    btn.insertAdjacentHTML("beforeend", `<div style="margin-top:3px">${castraHpHTML({ hero:true, h }, 90)}</div>`);
    if(castraHpf({ hero:true, h })<=0){ btn.disabled = true; btn.style.opacity = ".5"; }
  });
};
