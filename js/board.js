// Detective-board hero + Workshop spotlight, driven by ONE requestAnimationFrame loop.
// Delta-time springs (capped 50ms), momentum tail after input, DOM reads batched before writes,
// cached layout, off-screen work skipped, loop sleeps once everything has settled.
(function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var PERF = /[?&]perf\b/.test(location.search);              // ?perf logs frames whose JS exceeds 10ms
  var wrap = document.getElementById('intro'), board = wrap.querySelector('.board'), stage = document.getElementById('stage');
  var svg = document.getElementById('strings'), ch2 = stage.querySelector('.n-ch2'), ws = document.getElementById('workshop');
  var FRAME = 1000 / 60, MAX_DT = 50, TAIL = 700;

  // ---------- static red strings (drawn once per layout) ----------
  function drawStrings() {
    var hero = stage.querySelector('[data-hero]'), W = stage.offsetWidth, H = stage.offsetHeight, d = '';
    function pin(n) { return [n.offsetLeft / W * 100, (n.offsetTop - n.offsetHeight / 2 + 8) / H * 100]; }
    var a = pin(hero);
    stage.querySelectorAll('[data-string]').forEach(function (n) {
      var b = pin(n), mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2 + 4;
      d += '<path stroke="#8b3a2b" stroke-width="2" fill="none" d="M' + a[0] + ' ' + a[1] + ' Q' + mx + ' ' + my + ' ' + b[0] + ' ' + b[1] + '"/>';
    });
    svg.innerHTML = d;
  }

  // ---------- spotlight items ----------
  var vg = null, items = [], active = 0, mode = 'title', pinned = false;
  if (ws) {
    vg = document.createElement('div');
    vg.className = 'vignette'; vg.setAttribute('aria-hidden', 'true'); document.body.appendChild(vg);
    var intro = ws.querySelector('.spot-intro');
    items.push({ box: intro, title: intro, widget: null });
    ws.querySelectorAll('.exp').forEach(function (a) {
      items.push({ box: a, title: a.querySelector('.exp-text') || a, widget: a.querySelector('.cli-note,.calc,.slot,.photo') });
    });
    items.forEach(function (it, i) {
      if (!it.widget) return;
      var f = function () { active = i; mode = 'widget'; pinned = true; lastPick = 0; wake(); };
      it.widget.addEventListener('pointerdown', f);
      it.widget.addEventListener('focusin', f);
    });
    // two-way spotlight: clicking the description/title container shifts the spotlight back to the text
    items.forEach(function (it, i) {
      if (!it.title) return;
      var g = function () { active = i; mode = 'title'; pinned = true; lastPick = 0; wake(); };
      it.title.addEventListener('pointerdown', g);
      it.title.addEventListener('focusin', g);
    });
  }

  // ---------- sticky notes (rotational inertia) ----------
  var notes = [].slice.call(document.querySelectorAll('.cli-note:not(.kanban-note),.calc,.slot,.photo,.board .paper')).map(function (el, i) {
    return { el: el, zone: el.closest('.board') ? 'intro' : 'ws', base: 0, th: 0, w: 0, on: false, k: 0.7 + (i % 4) * 0.15 };
  });

  // ---------- cached measurements ----------
  var M = {}, focusNode = null, fCache = {};
  function docBox(el) {
    var r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + scrollY + r.height / 2, w: r.width, h: r.height };
  }
  function measure() {
    M.vh = innerHeight; M.vw = innerWidth;
    M.wrapEnd = wrap.offsetHeight; M.zoomSpan = Math.max(1, wrap.offsetHeight - innerHeight);
    M.ch2 = { x: ch2.offsetLeft, y: ch2.offsetTop };
    stage.style.transformOrigin = '0 0';
    if (ws) {
      var r = ws.getBoundingClientRect();
      M.wsTop = r.top + scrollY; M.wsBot = M.wsTop + r.height;
      items.forEach(function (it) { it.b = docBox(it.box); it.t = docBox(it.title); it.w = it.widget ? docBox(it.widget) : null; });
    }
    notes.forEach(function (n) { n.base = parseFloat(getComputedStyle(n.el).getPropertyValue('--tilt')) || 0; });
  }
  function remeasure() { measure(); drawStrings(); lastPick = 0; wake(); }
  addEventListener('resize', remeasure);
  addEventListener('load', remeasure);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(remeasure);

  // ---------- state ----------
  var zoom = { cur: 0, vel: 0 };                // scroll-driven zoom
  var fz = { cur: 0, vel: 0 };                  // click-driven zoom/centering
  var fp = { x: 0, y: 0, vx: 0, vy: 0, init: false };   // focus point (stage px)
  var sp = { x: innerWidth / 2, y: innerHeight / 2, r: 300, vx: 0, vy: 0, vr: 0 };
  var lastOpacity = 1, gone = false, vgOn = false, onBoard = null, lastPick = 0, last = 0, raf = 0, tailUntil = 0, prevSy = scrollY;

  // dt-scaled spring: identical feel at any refresh rate
  function spring(cur, vel, target, k, damp, f) {
    vel += (target - cur) * k * f;
    vel *= Math.pow(damp, f);
    return [cur + vel * f, vel];
  }

  function applyRetreat() {
    for (var j = 0; j < items.length; j++) {
      items[j].title.classList.toggle('retreat', j === active && mode === 'widget' && !!items[j].widget);
    }
  }
  function pick(sy, now) {
    var mid = M.vh / 2, best = active, bd = 1e9;
    if (pinned) {                               // keep the spotlight where the visitor clicked (widget OR description) while that project is mid-screen
      var ab = items[active].b, top = ab.y - sy - ab.h / 2, bot = top + ab.h;
      if (bot > M.vh * 0.2 && top < M.vh * 0.8) { applyRetreat(); lastPick = now; return; }
      pinned = false; mode = 'title';
    }
    for (var i = 0; i < items.length; i++) {
      var d = Math.abs(items[i].b.y - sy - mid);
      if (d < bd) { bd = d; best = i; }
    }
    if (best !== active) { active = best; mode = 'title'; }
    applyRetreat(); lastPick = now;
  }

  function frame(now) {
    raf = 0;
    var t0 = PERF ? performance.now() : 0;
    var dt = Math.max(1, Math.min(now - last, MAX_DT)); last = now;       // delta time, capped
    var f = dt / FRAME, moving = false;

    // ----- READ phase (scroll position + cached numbers only) -----
    var sy = scrollY, vy = (sy - prevSy) / dt; prevSy = sy;
    var introVisible = sy < M.wrapEnd;
    var wsVisible = !!ws && sy + M.vh * 0.75 > M.wsTop && sy + M.vh * 0.25 < M.wsBot;   // dim only while the projects fill the screen, never over Chapter 03
    var zt = reduce ? 0 : Math.min(1, Math.max(0, sy / M.zoomSpan));
    if (wsVisible && now - lastPick > 100) pick(sy, now);
    var tx, ty, tr;
    if (wsVisible) {
      var it = items[active], c = (mode === 'widget' && it.w) ? it.w : it.t;
      tx = c.x; ty = c.y - sy; tr = Math.min(520, Math.max(170, Math.max(c.w, c.h) / 2 * 0.9 + 80));
    }
    if (!introVisible && focusNode) { focusNode = null; fz.cur = fz.vel = 0; }   // leaving the board resets click focus
    var fx = focusNode ? focusNode.offsetLeft : M.ch2.x, fy = focusNode ? focusNode.offsetTop : M.ch2.y;

    // ----- WRITE phase (transform / opacity; one paint-only var update for the vignette mask) -----
    if (introVisible) {
      if (!fp.init) { fp.x = fx; fp.y = fy; fp.init = true; }
      var z = spring(zoom.cur, zoom.vel, zt, 0.08, 0.8, f); zoom.cur = z[0]; zoom.vel = z[1];
      var q = spring(fz.cur, fz.vel, focusNode ? 1 : 0, 0.08, 0.8, f); fz.cur = q[0]; fz.vel = q[1];
      var px = spring(fp.x, fp.vx, fx, 0.1, 0.78, f), py = spring(fp.y, fp.vy, fy, 0.1, 0.78, f);
      fp.x = px[0]; fp.vx = px[1]; fp.y = py[0]; fp.vy = py[1];

      var sc = 1 + Math.max(zoom.cur * 2.4, fz.cur * 1.4);
      var cf = Math.min(1, Math.max(0, fz.cur));                            // how strongly to centre the focused note
      var ox = fp.x * (1 - sc) + (M.vw / 2 - fp.x) * cf, oy = fp.y * (1 - sc) + (M.vh / 2 - fp.y) * cf;
      ox = Math.min(0, Math.max(M.vw * (1 - sc), ox)); oy = Math.min(0, Math.max(M.vh * (1 - sc), oy));   // never reveal the stage edge
      stage.style.transform = 'translate3d(' + ox + 'px,' + oy + 'px,0) scale3d(' + sc + ',' + sc + ',1)';

      var op = zoom.cur > 0.78 ? Math.max(0, 1 - (zoom.cur - 0.78) / 0.2) : 1;
      if (Math.abs(op - lastOpacity) > 0.004) { stage.style.opacity = op; lastOpacity = op; }
      var g = op <= 0.01;
      if (g !== gone) { stage.classList.toggle('gone', g); gone = g; }
      if (Math.abs(zt - zoom.cur) + Math.abs(zoom.vel) + Math.abs(fz.cur - (focusNode ? 1 : 0)) + Math.abs(fz.vel) +
          Math.abs(fx - fp.x) + Math.abs(fy - fp.y) + Math.abs(fp.vx) + Math.abs(fp.vy) > 0.003) moving = true;
    }
    var nb = sy < M.wrapEnd - M.vh * 0.6;
    if (nb !== onBoard) { document.body.classList.toggle('on-board', nb); onBoard = nb; }

    if (vg) {
      if (wsVisible !== vgOn) { vg.classList.toggle('on', wsVisible); vgOn = wsVisible; }
      if (wsVisible) {
        if (reduce) { sp.x = tx; sp.y = ty; sp.r = tr; }
        else {
          var a = spring(sp.x, sp.vx, tx, 0.07, 0.8, f), b = spring(sp.y, sp.vy, ty, 0.07, 0.8, f), r = spring(sp.r, sp.vr, tr, 0.07, 0.8, f);
          sp.x = a[0]; sp.vx = a[1]; sp.y = b[0]; sp.vy = b[1]; sp.r = r[0]; sp.vr = r[1];
          if (Math.abs(tx - sp.x) + Math.abs(ty - sp.y) + Math.abs(tr - sp.r) > 0.6 || Math.abs(sp.vx) + Math.abs(sp.vy) > 0.02) moving = true;
        }
        if (Math.abs(sp.x - (fCache.x || 0)) > 0.25 || Math.abs(sp.y - (fCache.y || 0)) > 0.25 || Math.abs(sp.r - (fCache.r || 0)) > 0.25) {
          vg.style.setProperty('--sx', sp.x + 'px'); vg.style.setProperty('--sy', sp.y + 'px'); vg.style.setProperty('--sr', sp.r + 'px');
          fCache.x = sp.x; fCache.y = sp.y; fCache.r = sp.r;
        }
      }
    }

    // sticky-note physics: scroll velocity -> angular impulse; spring pulls back with heavy damping
    for (var i = 0; i < notes.length; i++) {
      var n = notes[i];
      if (n.zone === 'intro' ? !introVisible : !wsVisible) continue;
      if (!reduce) {
        if (Math.abs(vy) > 0.05) n.w += Math.max(-5, Math.min(5, vy)) * 0.07 * f * n.k;
        n.w += -n.th * 0.05 * f;
        n.w *= Math.pow(0.93, f);
        n.th = Math.max(-8, Math.min(8, n.th + n.w * f));
      }
      if (Math.abs(n.th) > 0.02 || Math.abs(n.w) > 0.02) {
        n.el.style.transform = 'rotate3d(0,0,1,' + (n.base + n.th) + 'deg)'; n.on = true; moving = true;
      } else if (n.on) { n.th = n.w = 0; n.el.style.transform = ''; n.on = false; }
    }

    if (PERF) { var ms = performance.now() - t0; if (ms > 10) console.warn('frame JS ' + ms.toFixed(1) + 'ms (budget 10ms)'); }
    if (moving || now < tailUntil) raf = requestAnimationFrame(frame);     // momentum tail keeps springs finishing
  }
  function wake() {
    tailUntil = performance.now() + TAIL;
    if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame); }
  }

  // ---------- click / tap on board components: smooth zoom focus ----------
  function go(link) {
    var t = document.querySelector(link.getAttribute('href'));
    if (t) { t.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth' }); history.replaceState(null, '', link.getAttribute('href')); }
  }
  stage.addEventListener('click', function (e) {
    if (e.target.closest('a.btn')) return;                                   // the hero button keeps its normal link
    var n = e.target.closest('.node');
    if (!n) { if (focusNode) { focusNode = null; wake(); } return; }         // empty board: zoom back out
    if (n.hasAttribute('data-hero')) return;
    var isLink = n.tagName === 'A';
    if (isLink) e.preventDefault();
    if (reduce) { if (isLink) go(n); return; }
    if (focusNode === n && !isLink) { focusNode = null; wake(); return; }
    focusNode = n; wake();
    if (isLink) setTimeout(function () { go(n); }, 550);                      // let the zoom land, then travel
  });
  addEventListener('keydown', function (e) { if (e.key === 'Escape' && focusNode) { focusNode = null; wake(); } });

  // ---------- cat paw: instant pop at the pointer ----------
  var paws = [].slice.call(board.querySelectorAll('.paw')), pi = 0;
  paws.forEach(function (p) { p.firstElementChild.addEventListener('animationend', function (e) { e.target.classList.remove('pop'); }); });
  board.addEventListener('pointerdown', function (e) {
    if (!paws.length) return;
    var p = paws[pi++ % paws.length], s = p.firstElementChild, r = board.getBoundingClientRect();
    p.style.transform = 'translate3d(' + (e.clientX - r.left - 22) + 'px,' + (e.clientY - r.top - 22) + 'px,0)';
    s.style.setProperty('--rot', ((pi * 37) % 40 - 20) + 'deg');
    if (s.classList.contains('pop')) { s.classList.remove('pop'); void s.getBoundingClientRect(); }
    s.classList.add('pop');
  }, { passive: true });

  // ---------- inputs wake the loop (and start the momentum tail) ----------
  ['scroll', 'wheel', 'touchmove'].forEach(function (t) { addEventListener(t, wake, { passive: true }); });
  measure(); drawStrings(); wake();
})();
