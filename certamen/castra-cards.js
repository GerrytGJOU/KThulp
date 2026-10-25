/* ============================================================================
   CASTRA HEROUM — TABULAE (KAARTEN): ACCOUNTBREDE BONUSSEN
   ----------------------------------------------------------------------------
   Kaarten geven kleine, blijvende bonussen aan je hele account (alle torens +x%
   schade, meer productie, enz.). Je trekt ze met roem (🏆) en elke dag mag je
   één keer gratis trekken. Trek je een kaart die je al hebt, dan wordt de bonus
   sterker: bij 1, 2, 4, 7 en 12 exemplaren heeft de kaart 1 t/m 5 sterren.
   Bonus = sterren × waarde per ster. Zeldzamere kaarten zijn sterker (en
   specialistischer). Geen echt geld, geen energie.
   Opslag: CASTRA.cards = { id: aantal }, CASTRA.cardState = { freeDay, pity, last }.
   Werken in de gewone (solo) tower defence en in de economie; NIET in de Legio,
   want daar moet elke deelnemer exact dezelfde simulatie draaien.
   Laadt NA castra-skills.js; haakt in op castra-battle.js / castra-menu.js.
   ============================================================================ */

const CASTRA_CARD_STARS = [1, 2, 4, 7, 12];            // aantal exemplaren voor ★1 … ★5
const CASTRA_CARD_COST = 5;                            // roem per extra trekking (de eerste van de dag is gratis)
const CASTRA_CARD_PITY = 10;                           // elke 10e trekking zonder zeldzame kaart is zeker een zeldzame
const CASTRA_CARD_RARITY = { 1:{ nm:"gewoon", w:60, col:"#8a7a5a" }, 2:{ nm:"bijzonder", w:28, col:"#2e7d6b" }, 3:{ nm:"zeldzaam", w:12, col:"#8a2a6b" } };
// eff: sleutel in de bonus-som; per: waarde per ster; fmt: tekst per ster-aantal.
const CASTRA_CARDS = [
  { id:"vires",      la:"Vires",      rar:1, eff:"dmg",  per:2,  txt:v=>`alle torens +${v}% schade` },
  { id:"celeritas",  la:"Celeritas",  rar:1, eff:"cd",   per:2,  txt:v=>`alle torens +${v}% schiettempo` },
  { id:"acies",      la:"Acies",      rar:1, eff:"rng",  per:2,  txt:v=>`alle torens +${v}% bereik` },
  { id:"horrea",     la:"Horrea",     rar:1, eff:"prod", per:3,  txt:v=>`+${v}% grondstoffenproductie` },
  { id:"disciplina", la:"Disciplina", rar:1, eff:"xp",   per:3,  txt:v=>`+${v}% ervaring voor soldaten en helden` },
  { id:"fabri",      la:"Fabri",      rar:2, eff:"build",per:3,  txt:v=>`gebouwen in het kamp bouwen ${v}% sneller (geldt voor nieuwe bouwwerken)` },
  { id:"gelu",       la:"Gelu",       rar:2, eff:"spd",  per:1.5,txt:v=>`vijanden lopen ${v}% langzamer` },
  { id:"murus",      la:"Murus",      rar:2, eff:"lives",per:0.5,txt:v=>`+${Math.floor(v)} leven${Math.floor(v)===1?"":"s"} voor het kamp (1 per 2 sterren)` },
  { id:"praeda",     la:"Praeda",     rar:2, eff:"reward",per:3, txt:v=>`+${v}% beloning na een missie` },
  { id:"scutum",     la:"Scutum",     rar:3, eff:"t_inf",per:4,  txt:v=>`voetsoldaten +${v}% schade` },
  { id:"sagitta",    la:"Sagitta",    rar:3, eff:"t_rng",per:4,  txt:v=>`schutters +${v}% schade` },
  { id:"equites",    la:"Equites",    rar:3, eff:"t_cav",per:4,  txt:v=>`ruiters +${v}% schade` },
  { id:"auxilia",    la:"Auxilia",    rar:3, eff:"t_sup",per:4,  txt:v=>`hulptroepen +${v}% schade` },
  { id:"monstra",    la:"Monstra",    rar:3, eff:"t_myth",per:4, txt:v=>`monsters +${v}% schade` },
];
function castraCardCopies(id){ return (CASTRA.cards||{})[id]||0; }
function castraCardStars(id){ const n = castraCardCopies(id); let s = 0; CASTRA_CARD_STARS.forEach((t,i)=>{ if(n>=t) s = i+1; }); return s; }
function castraCardNext(id){ const n = castraCardCopies(id); const t = CASTRA_CARD_STARS.find(x=>x>n); return t||null; }
function castraCardVal(c){ const st = castraCardStars(c.id); return st ? Math.round(st*c.per*10)/10 : 0; }
// Som van alle bonussen: { dmg, cd, rng, prod, xp, spd, lives, reward, build, type:{inf,rng,cav,sup,myth} }
function castraCardBonus(){
  const b = { dmg:0, cd:0, rng:0, prod:0, xp:0, spd:0, lives:0, reward:0, build:0, type:{ inf:0, rng:0, cav:0, sup:0, myth:0 } };
  if(typeof CASTRA==="undefined" || !CASTRA) return b;
  CASTRA_CARDS.forEach(c=>{ const v = castraCardVal(c); if(!v) return;
    if(c.eff.indexOf("t_")===0) b.type[c.eff.slice(2)] += v; else b[c.eff] += (c.eff==="lives" ? Math.floor(v) : v); });
  return b;
}
function castraCardAny(){ return CASTRA_CARDS.some(c=>castraCardCopies(c.id)>0); }
function castraCardXp(base){ const x = castraCardBonus().xp; return x ? Math.round(base*(100+x)/100) : base; }
// Toepassen op een solo-gevecht (aangeroepen door castraBStart).
function castraCardApply(B){
  const b = castraCardBonus(), m = B.sim.mods;
  m.dmg = Math.round(m.dmg*(100+b.dmg)/100*1000)/1000;
  m.cd = Math.round(m.cd*100/(100+b.cd)*1000)/1000;
  m.rng = Math.round(m.rng*(100+b.rng)/100*1000)/1000;
  m.spd = Math.round(m.spd*(100-b.spd)/100*1000)/1000;
  m.type = b.type;
  B.sim.baseHp += b.lives;
  B.rewardMult = (B.rewardMult||1) * (100+b.reward)/100;
  B.cardInfo = b;
}
function castraCardSummary(b){
  const p = [];
  if(b.dmg) p.push("+"+b.dmg+"% schade"); if(b.cd) p.push("+"+b.cd+"% tempo"); if(b.rng) p.push("+"+b.rng+"% bereik"); if(b.spd) p.push("vijanden −"+b.spd+"%");
  if(b.lives) p.push("+"+b.lives+" leven"); if(b.reward) p.push("+"+b.reward+"% beloning");
  ["inf","rng","cav","sup","myth"].forEach(t=>{ if(b.type[t]) p.push(({inf:"voet",rng:"schutters",cav:"ruiters",sup:"hulp",myth:"monsters"})[t]+" +"+b.type[t]+"%"); });
  return p.join(" · ");
}

/* ---------- trekken ---------- */
function castraCardState(){ const s = CASTRA.cardState || (CASTRA.cardState = { freeDay:-1, pity:0, last:null, tokens:0 }); if(s.tokens===undefined) s.tokens = 0; return s; }
// Trekkingen verdienen met opdrachten ("tokens"); worden vóór roem gebruikt.
function castraCardToken(n, why, quiet){
  const st = castraCardState(); st.tokens += n; castraSave();
  if(!quiet && typeof toast==="function") toast("🎟️ +"+n+" kaartentrekking"+(n===1?"":"en"), why||"");
}
function castraCardFreeLeft(){ return castraCardState().freeDay !== castraDay(); }
function castraCardPick(rng, guaranteeRare){
  let r = rng()*100, rar = 1;
  if(guaranteeRare) rar = 3; else { r -= CASTRA_CARD_RARITY[1].w; if(r>=0){ rar = 2; r -= CASTRA_CARD_RARITY[2].w; if(r>=0) rar = 3; } }
  const pool = CASTRA_CARDS.filter(c=>c.rar===rar);
  return pool[Math.floor(rng()*pool.length)];
}
// Retourneert { card, before, after, free } of null (te weinig roem).
function castraCardDraw(){
  const st = castraCardState(), free = castraCardFreeLeft();
  let how = "free";
  if(free) st.freeDay = castraDay();
  else if(st.tokens>0){ st.tokens--; how = "token"; }
  else { if((CASTRA.res.gloria||0) < CASTRA_CARD_COST) return null; CASTRA.res.gloria -= CASTRA_CARD_COST; how = "gloria"; }
  const rng = castraRng((castraNow() ^ CASTRA.seed ^ 0x7ab1c3)>>>0); CASTRA.seed = (CASTRA.seed+13)>>>0;
  const card = castraCardPick(rng, st.pity >= CASTRA_CARD_PITY-1);
  st.pity = card.rar===3 ? 0 : st.pity+1;
  const before = castraCardStars(card.id);
  (CASTRA.cards || (CASTRA.cards = {}))[card.id] = castraCardCopies(card.id)+1;
  const after = castraCardStars(card.id);
  st.last = { id:card.id, isNew:castraCardCopies(card.id)===1, up:after>before };
  castraSave(); if(typeof castraRenderRes==="function") castraRenderRes();
  return { card, before, after, free, how, isNew:st.last.isNew };
}
function castraMenuDraw(){
  const r = castraCardDraw();
  if(!r){ toast("Te weinig roem", "Een extra trekking kost "+CASTRA_CARD_COST+" 🏆. Win missies voor roem."); return; }
  const stars = "★".repeat(r.after)+"☆".repeat(5-r.after);
  toast("🃏 "+r.card.la+(r.isNew?" — nieuw!":r.after>r.before?" — sterker!":""), stars+" · "+r.card.txt(castraCardVal(r.card)));
  if(typeof castraMenuRender==="function") castraMenuRender();
}

/* ---------- weergave (menu) ---------- */
function castraCardsView(){
  const st = castraCardState(), free = castraCardFreeLeft(), sum = castraCardSummary(castraCardBonus());
  const owned = CASTRA_CARDS.filter(c=>castraCardCopies(c.id)>0).length;
  const cards = CASTRA_CARDS.map(c=>{
    const n = castraCardCopies(c.id), s = castraCardStars(c.id), nx = castraCardNext(c.id), R = CASTRA_CARD_RARITY[c.rar], last = st.last && st.last.id===c.id;
    return `<div style="padding:6px 8px;margin:4px 0;border:2px solid ${n?R.col:"var(--parch-line,#c2a96f)"};border-radius:8px;${n?"background:rgba(255,248,225,.5)":"opacity:.55"};${last?"box-shadow:0 0 0 3px var(--hi,#d4af37)":""}">
      <div style="display:flex;justify-content:space-between;gap:8px"><b>${n?"":"❔ "}${esc(c.la)} ${last?(st.last.isNew?"<small style='color:#7a2a14'>nieuw!</small>":st.last.up?"<small style='color:#7a2a14'>sterker!</small>":""):""}</b>
        <span style="color:${R.col}">${"★".repeat(s)}${"☆".repeat(5-s)}</span></div>
      <div style="font-size:13px">${n?esc(c.txt(castraCardVal(c))):esc(c.txt(c.per))+" <small>(per ster)</small>"}</div>
      <div style="font-size:12px;opacity:.7">${R.nm} · ${n} exemplaar${n===1?"":"en"}${nx?` · nog ${nx-n} voor ★${castraCardStars(c.id)+1}`:" · maximaal"}</div></div>`;
  }).join("");
  return `<h3 style="margin:0 0 4px">Tabulae <small>kaarten</small></h3>
    <div style="font-size:13px;opacity:.85;margin-bottom:6px">Kaarten geven blijvende bonussen aan al je torens en je kamp. Trek je een kaart dubbel, dan wordt hij sterker (★ bij 1, 2, 4, 7 en 12 exemplaren). Werkt in de gewone tower defence en de economie, niet in de Legio.</div>
    <div style="padding:6px 8px;border:2px solid var(--hi-dim,#8a6d2f);border-radius:8px;background:rgba(212,175,55,.18);font-size:14px;margin-bottom:8px"><b>Je bonussen:</b> ${sum?esc(sum):"<span style='opacity:.6'>nog geen — trek je eerste kaart!</span>"}</div>
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px">
      <button class="btn btn-gold" style="min-height:44px" onclick="castraMenuDraw()">${free?"🎁 Gratis trekking van vandaag":st.tokens>0?"🎟️ Trek een kaart (1 trekking)":"🃏 Trek een kaart ("+CASTRA_CARD_COST+" 🏆)"}</button>
    </div>
    <div style="font-size:12px;opacity:.7;margin-bottom:4px">🎟️ ${st.tokens} trekking${st.tokens===1?"":"en"} (verdien ze met opdrachten, missies en nieuwe helden) · ${owned} / ${CASTRA_CARDS.length} kaarten · zekere zeldzame kaart over ${CASTRA_CARD_PITY-1-st.pity<=0?"0":CASTRA_CARD_PITY-1-st.pity} trekkingen · roem: ${CASTRA.res.gloria||0} 🏆</div>${cards}`;
}
