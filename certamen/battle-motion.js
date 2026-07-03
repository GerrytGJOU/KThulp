/* ============================================================================
   BATTLE MOTION — RPG Maker MV-stijl sideview-battler motion state machine
   ----------------------------------------------------------------------------
   Herimplementatie (GEEN kopie) van hoe RPG Maker MV's Sprite_Actor battler-
   animaties aanstuurt (zie rpg_sprites.js: Sprite_Actor.MOTIONS / startMotion /
   updateFrame / updateMotionCount / refreshMotion). Zelfde grid-adressering,
   zelfde timing, zelfde ping-pong-framevolgorde — eigen, framework-vrije code.

   Spritesheet-contract (RPG Maker MV SV-Actor-formaat):
     9 kolommen × 6 rijen, 3 frames per motion.
     motionIndex 0-17  →  rij = index % 6,  kolomgroep = ⌊index/6⌋ (0,1,2)
     kolom = kolomgroep*3 + frame   (frame 0,1,2 binnen de groep)

   Ping-pong (exact zoals MV):
     loop-motion    → ruwe teller 0,1,2,3,0,1,2,3,… ; getoond frame = teller<3 ? teller : 1
                       → zichtbaar: 0,1,2,1,0,1,2,1,…
     non-loop motion→ speelt eenmalig 0,1,2 en valt daarna terug op `next`

   Gebruik (framework-vrij, geen afhankelijkheid van BM_-globals of Firebase):
     BattleMotion.play(pixelHeroEl, "swing");
     BattleMotion.play(pixelHeroEl, "damage", { onComplete: ()=>{...} });
     BattleMotion.ensureIdle(pixelHeroEl);      // idempotent: alleen als er nog niets speelt
     BattleMotion.stop(pixelHeroEl);            // stopt tracking (bv. bij verwijderen uit DOM)
     BattleMotion.defineMotion("charge", {index:6, loop:false, next:"idle", speed:160});

   `pixelHeroEl` = de container-div die de gelaagde sprite bevat (elke laag
   binnenin met class "mv-motion-layer" krijgt dezelfde rij/kolom via CSS-
   custom-properties --mv-row/--mv-col; zie index.html). Lagen die NIET aan
   het MV-grid moeten voldoen (bv. het wapen, dat een eigen 3-frame sheet in
   een ander formaat heeft) krijgen bewust géén "mv-motion-layer"-class en
   blijven buiten schot.

   Herbruikbaar voor: Battle Mode-spelers (nu), en later Boss Battles,
   Commander Spectres, Summons, NPC's — alles wat een MV SV-Actor-sheet
   gebruikt kan via dezelfde API aangestuurd worden.
   ============================================================================ */

const BattleMotion = (function () {
  "use strict";

  const GRID_COLS = 9, GRID_ROWS = 6; // vast MV SV-Actor-grid (3 kolomgroepen × 6 rijen)
  const DEFAULT_SPEED_MS = 200;        // MV: motionSpeed()=12 ticks @ 60fps = 200ms/pattern

  /* ---- Centrale motion-configuratie ----------------------------------------
     Eén plek voor alle motion-eigenschappen. Nieuwe motion toevoegen = één
     entry hier (of via defineMotion() vanuit andere modules) — verder hoeft
     er niets in de engine te veranderen.
     - index   : MV motion-index (0-17) → bepaalt rij + kolomgroep
     - loop    : true = blijft ping-pongen tot een andere motion gestart wordt
                 false = speelt 0,1,2 eenmalig af en valt terug op `next`
     - speed   : ms per pattern-stap (default 200, MV-getrouw)
     - next    : motion-naam waar non-loop motions automatisch naar terugvallen
  ---------------------------------------------------------------------------- */
  const MOTIONS = {
    idle:     { index: 1,  loop: true  },                     // MV "wait"
    walk:     { index: 0,  loop: true  },
    chant:    { index: 2,  loop: true  },                     // MV heeft dit; niet in de gevraagde lijst maar gratis meegenomen
    guard:    { index: 3,  loop: true  },
    damage:   { index: 4,  loop: false, next: "idle" },
    evade:    { index: 5,  loop: false, next: "idle" },
    thrust:   { index: 6,  loop: false, next: "idle" },
    swing:    { index: 7,  loop: false, next: "idle" },
    missile:  { index: 8,  loop: false, next: "idle" },
    skill:    { index: 9,  loop: false, next: "idle" },
    spell:    { index: 10, loop: false, next: "idle" },
    item:     { index: 11, loop: false, next: "idle" },
    escape:   { index: 12, loop: true  },
    victory:  { index: 13, loop: true  },
    dying:    { index: 14, loop: true  },
    abnormal: { index: 15, loop: true  },
    sleep:    { index: 16, loop: true  },
    dead:     { index: 17, loop: true  },
  };

  /** Nieuwe motion toevoegen of een bestaande overschrijven (uitbreidbaarheid). */
  function defineMotion(name, def) {
    MOTIONS[name] = Object.assign({ loop: false, next: "idle" }, def);
  }

  /* ---- Actieve instanties: element -> state --------------------------------
     Map (niet WeakMap) omdat we elke tick alle actieve instanties moeten
     kunnen doorlopen. Ontkoppelde DOM-nodes (formatie-rebuild elders in de
     app) worden lazily opgeruimd zodra ze niet meer in de DOM zitten. */
  const instances = new Map();

  function _state(el) {
    let s = instances.get(el);
    if (!s) {
      s = { motion: null, name: null, raw: 0, elapsed: 0, onComplete: null, layers: null };
      instances.set(el, s);
    }
    return s;
  }

  /** Start (of herbevestig) een motion op een element. Idempotent voor dezelfde motion. */
  function play(el, motionName, opts) {
    if (!el) return;
    const def = MOTIONS[motionName];
    if (!def) { console.warn("BattleMotion: onbekende motion '" + motionName + "'"); return; }
    opts = opts || {};
    const s = _state(el);
    if (s.name === motionName && !opts.restart) {
      // Zelfde motion opnieuw aanvragen (bv. herhaalde aanval) mag wél resetten
      // als de aanroeper dat expliciet vraagt; anders MV-gedrag: no-op.
      if (!opts.forceReset) return;
    }
    s.name = motionName;
    s.motion = def;
    s.raw = 0;
    s.elapsed = 0;
    s.onComplete = typeof opts.onComplete === "function" ? opts.onComplete : null;
    s.speed = opts.speed || def.speed || DEFAULT_SPEED_MS;
    s.next = opts.next || def.next || "idle";
    s.layers = el.querySelectorAll(".mv-motion-layer");
    _applyFrame(s, 0);
    _ensureTicking();
  }

  /** Speel idle, maar alleen als er nog geen motion actief is (voorkomt reset-flicker). */
  function ensureIdle(el) {
    if (!el) return;
    const s = instances.get(el);
    if (!s || !s.name) play(el, "idle");
  }

  /** Stop tracking van een element (bv. vlak voor het uit de DOM gehaald wordt). */
  function stop(el) {
    if (!el) return;
    instances.delete(el);
  }

  function _applyFrame(s, displayFrame) {
    const idx = s.motion.index;
    const row = idx % GRID_ROWS;
    const group = Math.floor(idx / GRID_ROWS);
    const col = group * 3 + displayFrame;
    if (s.layers) {
      for (let i = 0; i < s.layers.length; i++) {
        const layer = s.layers[i];
        layer.style.setProperty("--mv-row", row);
        layer.style.setProperty("--mv-col", col);
      }
    }
  }

  /** Eén pattern-stap volgens MV's exacte ping-pong/stop-regels. */
  function _advance(s, el) {
    if (s.motion.loop) {
      s.raw = (s.raw + 1) % 4;
      _applyFrame(s, s.raw < 3 ? s.raw : 1);
    } else if (s.raw < 2) {
      s.raw++;
      _applyFrame(s, s.raw);
    } else {
      const cb = s.onComplete, nextName = s.next;
      if (cb) cb();
      // Val terug op de vervolg-motion (default idle); niets ingesteld?
      // Blijf gewoon op het laatste frame staan (net als MV's guard-uitzondering).
      if (nextName && MOTIONS[nextName]) {
        play(el, nextName);
      } else {
        s.name = null; s.motion = null;
      }
    }
  }

  /* ---- Centrale ticker (één requestAnimationFrame-loop voor alle instanties) */
  let _rafId = null, _lastTs = 0;
  function _ensureTicking() {
    if (_rafId != null) return;
    _lastTs = 0;
    _rafId = requestAnimationFrame(_tick);
  }

  function _tick(ts) {
    if (!_lastTs) _lastTs = ts;
    const dt = ts - _lastTs;
    _lastTs = ts;
    if (instances.size === 0) { _rafId = null; return; } // stop de loop als er niets meer speelt

    instances.forEach((s, el) => {
      if (!el.isConnected) { instances.delete(el); return; }
      if (!s.motion) return;
      s.elapsed += dt;
      while (s.elapsed >= s.speed) {
        s.elapsed -= s.speed;
        _advance(s, el);
      }
    });
    _rafId = requestAnimationFrame(_tick);
  }

  return {
    MOTIONS,
    GRID_COLS, GRID_ROWS,
    defineMotion,
    play,
    ensureIdle,
    stop,
  };
})();
