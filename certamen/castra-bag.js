/* ============================================================================
   CASTRA HEROUM — SACCUS: VOORWERPEN DIE JE KUNT GEBRUIKEN (zoals de bag van Pokémon, maar Romeins)
   ----------------------------------------------------------------------------
   Alles wat hier staat bestond echt in de Romeinse wereld en heeft een Latijnse naam met een korte uitleg:
     Posca       zure wijn met water, de gewone drank van soldaten                        geneest 30% van je levenspunten
     Buccellatum hard soldatenbeschuit                                                   geneest 15%
     Mulsum      wijn met honing, een luxe                                               geneest 60%
     Theriaca    het beroemde wondermiddel en tegengif van Romeinse artsen               zet een gewonde soldaat of held weer op de been (50%)
     Suffimentum rookwerk van kruiden en hars                                            houdt zwakkere wilde vijanden 100 stappen weg
     Viaticum    het reisgeld dat een rekruut kreeg                                      +15% kans bij het werven (Capere)
     Donativum   het geldgeschenk aan soldaten                                           +30% kans bij het werven
     Hamus       vishaak (met riet)                                                      hiermee kun je vissen aan het water (blijft in je saccus)
   Opslag: CASTRA.bag = { id: aantal } (los van CASTRA.items, de opdrachtvoorwerpen), CASTRA.repel = resterende stappen.
   Kopen: de mercator in het kamp (menu ☰ → Sacculus). Vinden: verborgen vondsten, trainers en kampioenen.
   Gebruik: menu ☰ → Sacculus (buiten het gevecht), of de knop Saccus in het jachtgevecht (kost je beurt, alleen geneesmiddelen).
   Laadt NA castra-hp.js (genezing) en castra-hidden.js.
   ============================================================================ */
const CASTRA_GOODS = {
  posca:       { la:"Posca",       icon:"🍶", kind:"heal",    heal:0.30, price:{ aes:25 },                nl:"posca",        note:"Zure wijn met water: de gewone drank van Romeinse soldaten." },
  buccellatum: { la:"Buccellatum", icon:"🥖", kind:"heal",    heal:0.15, price:{ frumentum:12 },          nl:"soldatenbeschuit", note:"Hard beschuit dat maanden goed bleef, voedsel voor onderweg." },
  mulsum:      { la:"Mulsum",      icon:"🍯", kind:"heal",    heal:0.60, price:{ aes:70 },                nl:"honingwijn",   note:"Wijn met honing: een kostbare versterking." },
  theriaca:    { la:"Theriaca",    icon:"⚗️", kind:"revive",  heal:0.50, price:{ aes:120 },               nl:"wondermiddel", note:"Het beroemde tegengif en wondermiddel van Romeinse artsen. Zet iemand die buiten gevecht is weer op de been." },
  suffimentum: { la:"Suffimentum", icon:"🌿", kind:"repel",   steps:100, price:{ aes:40 },               nl:"rookwerk",     note:"Rook van kruiden en hars. Zwakkere wilde vijanden blijven 100 stappen weg." },
  viaticum:    { la:"Viaticum",    icon:"🪙", kind:"recruit", bonus:0.15, price:{ aes:30 },               nl:"reisgeld",     note:"Het reisgeld dat een rekruut kreeg. Geef het aan een vijand om hem te overtuigen: +15% kans bij het werven." },
  donativum:   { la:"Donativum",   icon:"💰", kind:"recruit", bonus:0.30, price:{ aes:80, gloria:1 },     nl:"geldgeschenk", note:"Het geschenk dat soldaten kregen bij een feestelijke gelegenheid: +30% kans bij het werven." },
  libum:       { la:"Libum",       icon:"🥧", kind:"heal",    heal:0.40, price:{ frumentum:20 },        nl:"offerkoek",    note:"Een koekje van meel, kaas en honing dat Romeinen aan de goden offerden. Alleen op marktdag (nundinae) te koop.", nundOnly:true },
  hamus:       { la:"Hamus",       icon:"🎣", kind:"tool",                price:{ aes:35 },               nl:"vishaak",      note:"Een vishaak met riet. Met een hamus kun je aan het water vissen; hij blijft in je saccus.", once:true },
};
const CASTRA_GOODS_ORDER = ["posca","buccellatum","mulsum","libum","theriaca","suffimentum","viaticum","donativum","hamus"];

function castraBagMap(){ return CASTRA.bag || (CASTRA.bag = {}); }
function castraBagN(id){ return (CASTRA.bag && CASTRA.bag[id]) || 0; }
function castraBagAdd(id, n){ if(!CASTRA_GOODS[id]) return 0; const m = castraBagMap(); m[id] = Math.min(99, (m[id]||0)+(n||1)); return m[id]; }
function castraBagTake(id){ if(castraBagN(id)<1) return false; const m = castraBagMap(); m[id]--; if(m[id]<=0) delete m[id]; return true; }
// Op marktdag (nundinae, castra-nund.js) kosten grondstoffen 20% minder (afgerond omhoog); gloria niet.
function castraGoodPrice(id){
  const g = CASTRA_GOODS[id], on = typeof castraNundinae==="function" && castraNundinae().on, out = {};
  Object.keys(g.price).forEach(r=>{ out[r] = (on && r!=="gloria") ? Math.max(1, Math.ceil(g.price[r]*0.8)) : g.price[r]; });
  return out;
}
function castraPriceTxt(p){ return Object.keys(p).map(r=>castraRes(r).icon+" "+p[r]).join("  "); }
function castraBagBuy(id){
  const g = CASTRA_GOODS[id]; if(!g) return "?";
  if(g.once && castraBagN(id)>0) return "al_zo";
  if(g.nundOnly && !(typeof castraNundinae==="function" && castraNundinae().on)) return "geen_markt";
  const price = castraGoodPrice(id);
  if(!castraCanPay(price)) return "deest";
  castraPay(price); castraBagAdd(id, 1); castraSave(); return null;
}

/* ---------- gebruik buiten het gevecht ---------- */
// Wie kan dit voorwerp krijgen? Geeft eenheden: { key, u (voor castraHpf), name, hurt, frac }.
function castraBagTargets(kind){
  const out = [];
  (CASTRA.soldiers||[]).forEach(s=>{ const hurt = castraIsHurt(s), f = castraHpf(s);
    if(kind==="revive" ? (hurt || f<=0) : (!hurt && f>0 && f<0.999)) out.push({ key:s.id, u:s, name:castraSoldierName(s), hurt, frac:f }); });
  (CASTRA.heroes||[]).forEach(h=>{ const u = { hero:true, h }, f = castraHpf(u);
    if(kind==="revive" ? f<=0 : (f>0 && f<0.999)) out.push({ key:"hero_"+h.id, u, name:CASTRA_HERO_DATA[h.id].nm, hurt:f<=0, frac:f }); });
  return out;
}
function castraBagUse(id, key){
  const g = CASTRA_GOODS[id]; if(!g || castraBagN(id)<1) return "geen";
  if(g.kind==="repel"){ if((CASTRA.repel||0)>0) return "al_aan"; castraBagTake(id); CASTRA.repel = g.steps; castraSave(); return null; }
  if(g.kind!=="heal" && g.kind!=="revive") return "niet_hier";
  const t = castraBagTargets(g.kind).find(x=>x.key===key); if(!t) return g.kind==="revive" ? "niet_buiten" : "al_vol";
  castraBagTake(id);
  if(g.kind==="revive"){ const h = castraHpRec(t.u); h.hurtUntil = 0; h.hpf = g.heal; h.hpt = castraNow(); }   // weer op de been, met de helft van zijn leven
  else castraHpSet(t.u, Math.min(1, t.frac + g.heal));
  castraSave(); return null;
}

/* ---------- menu: Sacculus ---------- */
let CASTRA_BAGUI = { pick:null };
function castraBagMsg(code, g){
  return ({ geen:"Dat voorwerp heb je niet meer.", al_vol:"Daar is geen genezing nodig.", niet_buiten:"Die is niet buiten gevecht.", al_aan:"Het suffimentum brandt al.", niet_hier:"Dat gebruik je niet zo.",
    deest:"Daar heb je niet genoeg grondstoffen voor.", geen_markt:"Dat is alleen op marktdag te koop.", al_zo:"Je hebt al een "+(g?g.la:"")+"." })[code] || "Dat lukt nu niet.";
}
function castraBagPickTarget(id){ CASTRA_BAGUI.pick = CASTRA_BAGUI.pick===id ? null : id; castraMenuRender(); }
function castraBagGive(id, key){
  const g = CASTRA_GOODS[id], r = castraBagUse(id, key);
  if(r){ toast("🎒", castraBagMsg(r, g)); return; }
  CASTRA_BAGUI.pick = null;
  toast(g.icon+" "+g.la, g.kind==="revive" ? "Weer op de been!" : "Geneest.");
  castraMenuRender();
}
function castraBagUseNow(id){
  const g = CASTRA_GOODS[id], r = castraBagUse(id, null);
  if(r){ toast("🎒", castraBagMsg(r, g)); return; }
  toast(g.icon+" "+g.la, "Het rookwerk brandt: zwakkere wilde vijanden blijven "+g.steps+" stappen weg.");
  castraMenuRender();
}
function castraBagBuyClick(id){
  const g = CASTRA_GOODS[id], r = castraBagBuy(id);
  if(r){ toast("🏺", castraBagMsg(r, g)); return; }
  toast(g.icon+" "+g.la, "Gekocht voor "+castraPriceTxt(castraGoodPrice(id))+".");
  castraMenuRender(); if(typeof castraRenderRes==="function") castraRenderRes();
}
function castraBagRowHTML(id){
  const g = CASTRA_GOODS[id], n = castraBagN(id), picking = CASTRA_BAGUI.pick===id;
  const btn = "min-height:36px;padding:2px 10px;margin-left:6px;font-size:13px;font-family:inherit;cursor:pointer;border:2px solid var(--parch-edge,#4a3416);border-radius:8px;background:#e8c96a;color:var(--parch-ink,#2b1d0e)";
  const act = g.kind==="heal" || g.kind==="revive" ? `<button style="${btn}" onclick="castraBagPickTarget('${id}')">${picking?"Sluit":"Gebruik"}</button>`
    : g.kind==="repel" ? `<button style="${btn}" onclick="castraBagUseNow('${id}')">${(CASTRA.repel||0)>0 ? "Brandt ("+CASTRA.repel+")" : "Gebruik"}</button>`
    : g.kind==="recruit" ? `<small style="opacity:.7">bij het werven</small>` : `<small style="opacity:.7">aan het water</small>`;
  let tg = "";
  if(picking){ const T = castraBagTargets(g.kind);
    tg = `<div style="margin:4px 0 6px 38px">${T.length ? T.map(t=>`<div style="display:flex;align-items:center;gap:8px;padding:3px 0"><span style="flex:1;min-width:0">${esc(t.name)} ${castraHpHTML(t.u, 60)}</span><button style="${btn}" onclick="castraBagGive('${id}','${t.key}')">Geef</button></div>`).join("") : `<small style="opacity:.7">${g.kind==="revive" ? "Niemand is buiten gevecht." : "Niemand heeft genezing nodig."}</small>`}</div>`; }
  return `<div style="${CASTRA_MV_ROW};flex-wrap:wrap"><span style="font-size:24px;width:32px;text-align:center">${g.icon}</span>
    <div style="flex:1;min-width:140px"><b>${esc(g.la)}</b> <small style="opacity:.7">${esc(g.nl)}</small> <b>×${n}</b><div style="font-size:12px;opacity:.75">${esc(g.note)}</div></div>${act}</div>${tg}`;
}
// De winkel is open in het kamp (de mercator), of op marktdag bij een marktkraam in de wereld (CASTRA_BAGUI.market).
function castraBagShopOpen(){ return !!el("castraMap") || (CASTRA_BAGUI.market && typeof castraNundinae==="function" && castraNundinae().on); }
function castraBagShopHTML(){
  const nund = typeof castraNundinae==="function" ? castraNundinae() : { on:false, next:0 };
  const head = nund.on ? `<div class="note" style="margin:4px 0">🏺 ${castraLaHTML("Hodie nundinae sunt!", "Het is marktdag: alles is 20% goedkoper en er is libum te koop.", "bag_nund")}</div>`
    : `<div class="note" style="margin:4px 0;font-size:12px">🏺 Nundinae (marktdag) over ${nund.next} dag${nund.next===1?"":"en"}: dan is alles 20% goedkoper.</div>`;
  if(!castraBagShopOpen()) return head + `<div class="note" style="margin-top:6px">🏺 De mercator staat in het kamp (☰ → Castra). Op marktdag staat er ook een kraam bij de reisplek in elk land.</div>`;
  const btn = "min-height:36px;padding:2px 10px;margin-left:6px;font-size:13px;font-family:inherit;cursor:pointer;border:2px solid var(--parch-edge,#4a3416);border-radius:8px;background:#e8c96a;color:var(--parch-ink,#2b1d0e)";
  return head + CASTRA_GOODS_ORDER.filter(id=>!CASTRA_GOODS[id].nundOnly || nund.on).map(id=>{ const g = CASTRA_GOODS[id], have = castraBagN(id), price = castraGoodPrice(id), can = castraCanPay(price) && !(g.once && have>0);
    return `<div style="${CASTRA_MV_ROW};flex-wrap:wrap"><span style="font-size:22px;width:32px;text-align:center">${g.icon}</span>
      <div style="flex:1;min-width:140px"><b>${esc(g.la)}</b> <small style="opacity:.7">${esc(g.nl)}</small><div style="font-size:12px;opacity:.75">${esc(g.note)}</div></div>
      <button style="${btn};${can?"":"opacity:.5"}" onclick="castraBagBuyClick('${id}')">${g.once && have>0 ? "al gekocht" : castraPriceTxt(price)}</button></div>`; }).join("");
}
function castraBagMenuHTML(){
  const owned = CASTRA_GOODS_ORDER.filter(id=>castraBagN(id)>0), rows = owned.map(castraBagRowHTML).join("");
  return `<h4 style="margin:12px 0 2px">Saccus <small>voorwerpen om te gebruiken</small></h4>${rows || `<div class="note">${castraLaHTML("Saccus vacuus est.", "Je saccus is leeg. Koop iets bij de mercator in het kamp of vind iets onderweg.", "bag_vacuus")}</div>`}
    <h4 style="margin:12px 0 2px">Mercator <small>kopen</small></h4>${castraBagShopHTML()}`;
}
const _castraMenuBagBg0 = castraMenuBag;
castraMenuBag = function(){ return _castraMenuBagBg0.apply(this, arguments) + castraBagMenuHTML(); };

/* ---------- in het gevecht: de knop Saccus (kost je beurt) ---------- */
function castraBagBattleItems(V){
  const S = V && V.s && V.s.me; if(!S || V.over || V.ask || V.forced || S.hp<=0 || S.hp>=S.max) return [];
  return CASTRA_GOODS_ORDER.filter(id=>CASTRA_GOODS[id].kind==="heal" && castraBagN(id)>0);
}
function castraBagBattleOpen(){ const V = CASTRA_V; if(!V || V.over || V.busy) return; V.bagOpen = !V.bagOpen; castraVRender("battle"); }
function castraBagBattleUse(id){
  const V = CASTRA_V, g = CASTRA_GOODS[id]; if(!V || !V.s || V.over || V.busy || !g || castraBagN(id)<1) return;
  const S = V.s.me; if(S.hp<=0 || S.hp>=S.max) return;
  castraBagTake(id);
  const got = Math.min(Math.round(S.max*g.heal), S.max-S.hp); S.hp += got; castraMvSync(V);
  V.bagOpen = false; V.bagMsg = `${g.icon} <b>${esc(S.name)}</b>: <i>${esc(g.la)}</i> +${got} ❤️`; V.bagFx = { w:"me", k:"heal", n:got };
  castraSave(); castraMvPlay(V, null);      // de vijand slaat toe: je beurt is voor het voorwerp
}
const _castraMvRoundBag0 = castraMvRound;
castraMvRound = function(V, mine){
  const r = _castraMvRoundBag0.apply(this, arguments);
  if(V && V.bagMsg){ V.log.unshift(V.bagMsg); if(V.fx && V.bagFx) V.fx.unshift(V.bagFx); V.bagMsg = V.bagFx = null; }
  return r;
};
function castraBagBattleMenuHTML(V){
  const items = castraBagBattleItems(V), S = V.s.me;
  const cards = items.map(id=>{ const g = CASTRA_GOODS[id];
    return `<button class="tile" style="min-height:0;padding:8px 12px;text-align:left" onclick="castraBagBattleUse('${id}')"><h3 style="margin:0 0 2px">${g.icon} ${esc(g.la)} <small>×${castraBagN(id)} · +${Math.round(g.heal*100)}%</small></h3><p style="margin:0;font-size:12px">${esc(g.note)}</p></button>`; }).join("");
  return `<div style="margin-top:6px"><div style="font-size:16px;margin-bottom:6px"><b>🎒 Saccus</b> <small>(kost je beurt)</small></div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:6px">${cards || `<div class="note">Niets dat nu helpt.</div>`}</div>
    <button class="btn" style="margin-top:8px;min-height:44px" onclick="castraBagBattleOpen()">Terug</button></div>`;
}
const _castraVBattleHTMLBag0 = castraVBattleHTML;
castraVBattleHTML = function(){
  const V = CASTRA_V; let html = _castraVBattleHTMLBag0.apply(this, arguments);
  if(!V || !V.s) return html;
  if(V.bagOpen && !V.switching && !V.forced){
    const menu = castraBagBattleMenuHTML(V);
    return html.replace(/(<div id="castraVMenu"[^>]*>)[^]*?(<\/div><\/div>\s*$)/, (m,a,b)=>a+menu+b);
  }
  if(V.ask){                 // bij het werven: geef een viaticum of donativum mee
    const rec = CASTRA_GOODS_ORDER.filter(id=>CASTRA_GOODS[id].kind==="recruit" && castraBagN(id)>0);
    if(rec.length){
      const sel = V.recruitItem, row = `<div style="margin:6px 0 2px;font-size:14px"><b>🪙 Geef iets mee:</b> ${rec.map(id=>{ const g = CASTRA_GOODS[id], on = sel===id;
        return `<button class="btn ${on?"btn-gold":""}" style="margin:3px 6px 3px 0;min-height:40px" title="${esc(g.note)}" onclick="castraBagRecruitPick('${id}')">${g.icon} ${esc(g.la)} ×${castraBagN(id)} <small>+${Math.round(g.bonus*100)}%</small></button>`; }).join("")}</div>`;
      html = html.replace(/(<div style="font-size:15px;margin-bottom:4px">Wat voor soort vijand is dit\?<\/div>)/, `$1${row}`);
    }
  } else if(!V.over && !V.forced && !V.switching && castraBagBattleItems(V).length){
    html = html.replace(/(<button class="btn" style="flex:1;min-height:46px" onclick="castraVFlee\(\)">)/, `<button class="btn" style="flex:1;min-height:46px" onclick="castraBagBattleOpen()" title="Gebruik een voorwerp (kost je beurt)">🎒 Saccus</button>$1`);
  }
  return html;
};

/* ---------- werven met een geschenk ---------- */
function castraBagRecruitPick(id){ const V = CASTRA_V; if(!V || !V.ask) return; V.recruitItem = V.recruitItem===id ? null : id; castraVRender("battle"); }
const _castraMvCatchChanceBag0 = castraMvCatchChance;
castraMvCatchChance = function(V, latinOk){
  let p = _castraMvCatchChanceBag0.apply(this, arguments);
  if(V && V.recruitItem && CASTRA_GOODS[V.recruitItem] && CASTRA_GOODS[V.recruitItem].kind==="recruit") p = Math.max(0.05, Math.min(0.95, p + CASTRA_GOODS[V.recruitItem].bonus));
  return p;
};
const _castraVCatchTryBag0 = castraVCatchTry;
castraVCatchTry = function(k){
  const V = CASTRA_V, id = V && V.recruitItem;
  if(id && castraBagN(id)>0){ castraBagTake(id); castraSave(); } else if(V) V.recruitItem = null;       // het geschenk is weg, ook als hij niet overtuigd wordt
  const r = _castraVCatchTryBag0.apply(this, arguments);
  if(V) V.recruitItem = null;
  return r;
};

/* ---------- waar je voorwerpen krijgt ---------- */
// Een trainer verslagen: een posca; een kampioen voor het eerst: een mulsum.
const _castraBossWonBag0 = castraBossWon;
castraBossWon = function(V){
  const b = V && V.boss, key = b && String(b.key||""), day = castraWDay(), done = (CASTRA.wday||{})[key]===day;
  const firstChamp = key && key.indexOf("champ_")===0 && !(CASTRA.insignia && CASTRA.insignia[V.region]);
  const r = _castraBossWonBag0.apply(this, arguments);
  if(key && !done){
    if(key.indexOf("trainer_")===0){ castraBagAdd("posca", 1); setTimeout(()=>toast("🍶 Posca", "De trainer geeft je een kruikje posca."), 1400); }
    else if(firstChamp){ castraBagAdd("mulsum", 1); setTimeout(()=>toast("🍯 Mulsum", "De kampioen schenkt je honingwijn."), 1400); }
    castraSave();
  }
  return r;
};
