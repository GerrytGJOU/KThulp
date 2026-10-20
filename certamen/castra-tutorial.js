/* ============================================================================
   CASTRA HEROUM — DIALOOGVENSTER EN TUTORIAL
   ----------------------------------------------------------------------------
   Dialoogvenster zoals in RPG Maker: onderaan het scherm een donker tekstvak met
   witte rand, portret van de spreker links, Latijnse tekst (typmachine-effect,
   daarna tikbaar per woord) en de Nederlandse vertaling klein eronder.
   Tikken = doorgaan (eerste tik maakt de zin meteen af). Keuzes staan in het vak.

   Tutorial (Aeneas als gids), stap voor stap — zoals een starter-Pokémon:
     0  Welkom + kies een gratis soldaat (tier 2: Hastatus, Veles of Murmillo).
     1  Opdracht: vang een tweede soldaat (jacht in Latium, "werf" de verslagen vijand).
     2  Opdracht: win het eerste gevecht (tower defence, Defensio castrorum).
     3  Afsluiting + beloning; daarna vrij spel (99 = klaar).
   Opslag: CASTRA.tut = { step }. Oude saves (met soldaten/helden/missies) tellen als klaar.
   Laadt NA castra-heroes.js, castra-battle.js en castra-latin.js.
   ============================================================================ */

const CASTRA_TUT_GUIDE = "aeneas";
const CASTRA_TUT_STARTERS = [
  { form:"rom_hastatus", la:"Hastatus", nl:"voetsoldaat (Romein) — stevig" },
  { form:"rom_veles",    la:"Veles",    nl:"lichte schutter (Romein) — schiet van afstand" },
  { form:"gla_murmillo", la:"Murmillo", nl:"gladiator — sterke aanvaller" },
];
const CASTRA_TUT_STARTER_LVL = 10;
const CASTRA_TUT_REWARD = { aes:80, frumentum:60, gloria:2 };

const CASTRA_TUT_TEXT = {
  intro:[
    { la:"Salve, dux {naam}! Aeneas sum. Castra tua nova sunt.", nl:"Gegroet, leider {naam}! Ik ben Aeneas. Je kamp is nieuw." },
    { la:"Milites tibi opus sunt. Unum militem tibi do.", nl:"Je hebt soldaten nodig. Ik geef je er één." },
    { la:"Quem eligis?", nl:"Wie kies je?", choose:true },
  ],
  chosen:[
    { la:"Bene elegisti! Hic miles tuus est.", nl:"Goed gekozen! Deze soldaat is van jou." },
    { la:"Nunc alium militem cape. Per portam decumanam in Latium i. Hostem vince et eum conscribe.", nl:"Vang nu nog een soldaat. Ga door de porta decumana naar Latium. Versla een vijand en werf hem." },
  ],
  caught:[
    { la:"Optime! Duos milites habes.", nl:"Uitstekend! Je hebt twee soldaten." },
    { la:"Nunc castra defende. Per portam praetoriam i et proelium vince.", nl:"Verdedig nu het kamp. Ga door de porta praetoria en win het gevecht." },
    { la:"Milites tuos colloca et hostes vince!", nl:"Plaats je soldaten (tik op een soldaat, dan op een vrij vak) en versla de vijanden!" },
  ],
  done:[
    { la:"Optime, dux {naam}! Castra defendisti.", nl:"Uitstekend, leider {naam}! Je hebt het kamp verdedigd." },
    { la:"Iam scis venari, conscribere et pugnare.", nl:"Nu weet je hoe je jaagt, werft en vecht." },
    { la:"Nunc heroes quaere et regiones novas explora. Vale!", nl:"Zoek nu helden en verken nieuwe regio's. Tot ziens!" },
  ],
  bar1:{ la:"Alium militem cape!", nl:"Opdracht 1: vang een tweede soldaat. Ga door de porta decumana (bovenaan), win een gevecht en tik op \"Recipio\"." },
  bar2:{ la:"Castra defende!", nl:"Opdracht 2: win het eerste gevecht. Ga door de porta praetoria (rechts), kies \"Defensio castrorum\" en plaats je soldaten." },
};

/* ---------- dialoogvenster ---------- */
let CASTRA_DLG = null;
function castraDlgOpen(whoId, lines, done){
  castraDlgClose(true);
  CASTRA_DLG = { who:whoId, lines, i:0, typing:null, shown:false, done, chosen:null };
  const box = document.createElement("div");
  box.id = "castraDlg";
  box.style.cssText = "position:fixed;left:0;right:0;bottom:0;z-index:9990;display:flex;justify-content:center;padding:8px;box-sizing:border-box";
  box.onclick = ev=>{ if(ev.target.closest && ev.target.closest("button,.cl-w,.cl-i")) return; castraDlgNext(); };
  document.body.appendChild(box);
  castraDlgLine();
}
function castraDlgClose(silent){
  const D = CASTRA_DLG; if(D && D.typing) clearInterval(D.typing);
  CASTRA_DLG = null;
  const b = document.getElementById("castraDlg"); if(b) b.remove();
  if(!silent && D && D.done) D.done(D.chosen);
}
function castraDlgPortrait(d){
  return `<div style="flex:0 0 112px;width:112px;height:112px;overflow:hidden;border-radius:8px;background:#1b150e;border:2px solid #8a6d2f;position:relative">
    <div style="position:absolute;left:0;top:0;width:112px;height:112px">${castraAvatarHTML(d.look,"down",1,112)}</div></div>`;
}
function castraDlgLine(){
  const D = CASTRA_DLG, box = document.getElementById("castraDlg"); if(!D || !box) return;
  const ln = D.lines[D.i], d = CASTRA_HERO_DATA[D.who];
  D.shown = false; const laTxt = castraSub(ln.la);
  box.innerHTML = `<div style="width:min(100%,860px);box-sizing:border-box;display:flex;gap:12px;align-items:stretch;background:rgba(14,12,16,.95);border:3px solid #fff;border-radius:14px;padding:12px;box-shadow:0 0 0 2px #000,0 6px 24px rgba(0,0,0,.6)">
    ${castraDlgPortrait(d)}
    <div style="flex:1;min-width:0;display:flex;flex-direction:column">
      <div style="color:#d4af37;font-weight:bold;font-size:15px;margin-bottom:2px">${esc(d.nm)}</div>
      <div id="castraDlgLa" style="font-size:19px;line-height:1.35;min-height:52px;color:#fff"></div>
      <div id="castraDlgNl" style="font-size:12px;opacity:.8;margin-top:4px;min-height:16px;color:#d8cfbf"></div>
      <div id="castraDlgChoices" style="margin-top:6px"></div>
    </div>
    <div id="castraDlgArrow" style="align-self:flex-end;color:#fff;font-size:18px;visibility:hidden;animation:castraBlink 1s infinite">▼</div>
  </div>`;
  if(!document.getElementById("castraBlinkCss")){
    const st = document.createElement("style"); st.id = "castraBlinkCss"; st.textContent = "@keyframes castraBlink{0%,100%{opacity:1}50%{opacity:.2}}"; document.head.appendChild(st);
  }
  const laEl = document.getElementById("castraDlgLa"); let n = 0;
  if(D.typing) clearInterval(D.typing);
  D.typing = setInterval(()=>{ n++; laEl.textContent = laTxt.slice(0,n); if(n>=laTxt.length) castraDlgShown(); }, 22);
}
// Zin is af: tikbare woorden, vertaling klein eronder, keuzes of pijltje.
function castraDlgShown(){
  const D = CASTRA_DLG; if(!D) return;
  if(D.typing){ clearInterval(D.typing); D.typing = null; }
  if(D.shown) return; D.shown = true;
  const ln = D.lines[D.i];
  const laEl = document.getElementById("castraDlgLa"), nlEl = document.getElementById("castraDlgNl"), ch = document.getElementById("castraDlgChoices"), ar = document.getElementById("castraDlgArrow");
  if(!laEl) return;
  laEl.innerHTML = castraLaHTML(ln.la, ln.nl, "tut_"+D.who+"_"+D.i);
  nlEl.textContent = castraSub(ln.nl);
  if(ln.choose){
    ch.innerHTML = CASTRA_TUT_STARTERS.map((s,k)=>`<button class="btn btn-gold" style="margin:3px 6px 3px 0;min-height:44px" onclick="castraTutPick(${k})"><b>${esc(s.la)}</b> <small>${esc(s.nl)}</small></button>`).join("");
  } else ar.style.visibility = "visible";
}
function castraDlgNext(){
  const D = CASTRA_DLG; if(!D) return;
  if(!D.shown){ castraDlgShown(); return; }
  const ln = D.lines[D.i]; if(ln.choose) return;       // eerst kiezen
  if(D.i >= D.lines.length-1){ castraDlgClose(false); return; }
  D.i++; castraDlgLine();
}

/* ---------- tutorial ---------- */
function castraTutInit(){
  if(CASTRA.tut) return;
  const fresh = !(CASTRA.soldiers||[]).length && !(CASTRA.heroes||[]).length && !castraPMissionDone("m1");
  CASTRA.tut = { step: fresh ? 0 : 99 };
  castraSave();
}
function castraTutPick(k){
  const D = CASTRA_DLG, s = CASTRA_TUT_STARTERS[k]; if(!D || !s || CASTRA.tut.step!==0) return;
  const sol = castraRollSoldier(s.form); sol.lvl = CASTRA_TUT_STARTER_LVL;
  CASTRA.soldiers.push(sol); CASTRA.tut.step = 1; castraSave();
  castraDlgOpen(CASTRA_TUT_GUIDE, CASTRA_TUT_TEXT.chosen, ()=>{ castraTutBar(); });
  castraRenderRes();
}
function castraTutBar(){
  const bar = document.getElementById("castraTutBar"); if(!bar) return;
  const T = CASTRA.tut, t = T && (T.step===1 ? CASTRA_TUT_TEXT.bar1 : T.step===2 ? CASTRA_TUT_TEXT.bar2 : null);
  bar.innerHTML = t ? `<div style="margin:6px auto 10px;max-width:860px;padding:8px 12px;border:2px solid #d4af37;border-radius:10px;background:rgba(212,175,55,.12)">
      <div style="font-size:17px">🎯 ${castraLaHTML(t.la, t.nl, "tutbar"+T.step)}</div>
      <div style="font-size:13px;opacity:.85;margin-top:2px">${esc(t.nl)}</div></div>` : "";
}
// Aangeroepen aan het eind van SCREENS.castraHome.
function castraTutOnHome(){
  if(!CASTRA) return;
  castraTutInit();
  const T = CASTRA.tut; castraTutBar();
  if(CASTRA_DLG) return;
  if(T.step===0){
    castraDlgOpen(CASTRA_TUT_GUIDE, CASTRA_TUT_TEXT.intro, null);
  } else if(T.step===1 && CASTRA.soldiers.length>=2){
    T.step = 2; castraSave();
    castraDlgOpen(CASTRA_TUT_GUIDE, CASTRA_TUT_TEXT.caught, ()=>castraTutBar());
  } else if(T.step===2 && castraPMissionDone("m1")){
    T.step = 99;
    const cap = castraWalletCap();
    Object.keys(CASTRA_TUT_REWARD).forEach(r=>{ CASTRA.res[r] = Math.min(r==="gloria"?1e9:cap, (CASTRA.res[r]||0)+CASTRA_TUT_REWARD[r]); });
    castraSave(); castraRenderRes();
    castraDlgOpen(CASTRA_TUT_GUIDE, CASTRA_TUT_TEXT.done, ()=>{ castraTutBar(); castraToastLa("recte", "🎁 "+Object.keys(CASTRA_TUT_REWARD).map(r=>castraRes(r).icon+" "+CASTRA_TUT_REWARD[r]).join(" ")); });
  }
}
