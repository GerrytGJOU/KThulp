/* Heldenkamp — Nederlandse tikbare woorden met Engelse hulp. Wordt bij het bouwen gegenereerd
   (build.js vult HK_GLOSS uit overlay/woordenboek*.json) en laadt NA alle castra-scripts.
   Vervangt de Latijnse woordhulp van castra-latin.js: tik op een woord = Engelse betekenis. */
(function(){
  const HK_GLOSS = /*HK_GLOSS*/{};
  // Nederlandse normalisatie: kleine letters, accenten en apostrof (regio's) blijven, rand-leestekens weg.
  window.castraNorm = function(w){ return String(w).toLowerCase().replace(/[’‘]/g,"'").replace(/^[^a-zà-ÿ]+|[^a-zà-ÿ]+$/g,""); };
  // Alle Latijnse glossen (ook die uit andere castra-bestanden) weg; alleen het Nederlandse woordenboek telt.
  Object.keys(CASTRA_GLOSS).forEach(k=>{ delete CASTRA_GLOSS[k]; });
  Object.assign(CASTRA_GLOSS, HK_GLOSS);
  window.castraNameGloss = function(w){ const n = castraPlayerName(); if(!n) return null; return n.split(/\s+/).some(p=>castraNorm(p)===w) ? "your name" : null; };
  window.castraFormGloss = function(w){
    if(typeof CASTRA_FORM_LIST==="undefined") return null;
    if(!window._hkFormWords){ window._hkFormWords = {}; CASTRA_FORM_LIST.forEach(f=>{ f.nm.split(" ").forEach(p=>{ const k = castraNorm(p); if(k && !window._hkFormWords[k]) window._hkFormWords[k] = f.nm; }); }); }
    const nm = window._hkFormWords[w]; return nm ? "soldier type or people: "+nm : null;
  };
  window.castraTapWord = function(ev, node){
    ev.stopPropagation();
    const w = node.getAttribute("data-w");
    const meaning = CASTRA_GLOSS[w] || castraNameGloss(w) || castraFormGloss(w) || "(no translation yet)";
    castraLogHelp("words", w, node.textContent);
    let box = document.getElementById("castraGloss");
    if(!box){
      box = document.createElement("div"); box.id = "castraGloss";
      box.style.cssText = "position:fixed;left:50%;bottom:18px;transform:translateX(-50%);z-index:9998;background:#1b150e;color:var(--cream,#f1e6c4);border:1px solid var(--hi,#d4af37);border-radius:10px;padding:8px 14px;font-size:15px;box-shadow:0 4px 14px rgba(0,0,0,.5);max-width:90vw";
      document.body.appendChild(box);
    }
    box.innerHTML = `<b>${esc(node.textContent)}</b> = ${esc(meaning)}`;
    box.style.display = "block";
    clearTimeout(box._t); box._t = setTimeout(()=>{ box.style.display="none"; }, 3500);
  };
  // Heldenkamp heeft geen docentoverzicht en geen Firebase: opzoekingen blijven lokaal in CASTRA.help.
  window.castraHelpSync = function(){};
})();
