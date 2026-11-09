// Detective-board hero (strings, scroll zoom with rubber-band spring) + Workshop spotlight vignette.
(function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var wrap = document.getElementById('intro'), stage = document.getElementById('stage');
  var svg = document.getElementById('strings');

  // --- red strings from the hero note to each pinned note ---
  function drawStrings() {
    var hero = stage.querySelector('[data-hero]'), W = stage.offsetWidth, H = stage.offsetHeight, d = '';
    function pin(n) { return [n.offsetLeft / W * 100, (n.offsetTop - n.offsetHeight / 2 + 8) / H * 100]; }
    var a = pin(hero);
    stage.querySelectorAll('[data-string]').forEach(function (n) {
      var b = pin(n), mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2 + 4;
      d += '<path d="M' + a[0] + ' ' + a[1] + ' Q' + mx + ' ' + my + ' ' + b[0] + ' ' + b[1] + '"/>';
    });
    svg.innerHTML = d;
  }
  drawStrings(); addEventListener('resize', drawStrings);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(drawStrings);

  // --- scroll zoom toward the Workshop note, with elastic spring ---
  var cur = 0, vel = 0, zooming = false, ch2 = stage.querySelector('.n-ch2');
  function progress() {
    var h = wrap.offsetHeight - innerHeight;
    return h > 0 ? Math.min(1, Math.max(0, -wrap.getBoundingClientRect().top / h)) : 0;
  }
  function zoomTick() {
    var t = reduce ? 0 : progress();
    vel += (t - cur) * 0.08; vel *= 0.8; cur += vel;
    stage.style.transformOrigin = ch2.offsetLeft + 'px ' + ch2.offsetTop + 'px';
    stage.style.transform = 'scale(' + (1 + cur * 2.4) + ')';
    stage.style.opacity = cur > 0.78 ? Math.max(0, 1 - (cur - 0.78) / 0.2) : 1;
    if (Math.abs(t - cur) > 0.0008 || Math.abs(vel) > 0.0008) requestAnimationFrame(zoomTick);
    else zooming = false;
  }

  // --- navbar hidden while the board is on screen ---
  function navState() {
    document.body.classList.toggle('on-board', scrollY < wrap.offsetHeight - innerHeight * 0.6);
  }

  // --- sticky notes flap a little while scrolling ---
  var flapping = false, notes = document.querySelectorAll('.cli-note,.slot,.board .paper');
  function flap() {
    if (reduce || flapping) return;
    flapping = true;
    notes.forEach(function (n) { n.classList.add('flap'); });
    setTimeout(function () { notes.forEach(function (n) { n.classList.remove('flap'); }); }, 750);
    setTimeout(function () { flapping = false; }, 1000);
  }

  addEventListener('scroll', function () {
    navState(); flap();
    if (!zooming) { zooming = true; requestAnimationFrame(zoomTick); }
  }, { passive: true });
  navState(); zoomTick();

  // --- spotlight vignette over the Workshop ---
  var ws = document.getElementById('workshop');
  if (!ws) return;
  var vg = document.createElement('div');
  vg.className = 'vignette'; vg.setAttribute('aria-hidden', 'true'); document.body.appendChild(vg);
  var items = [{ box: ws.querySelector('.spot-intro'), title: ws.querySelector('.spot-intro'), widget: null }];
  ws.querySelectorAll('.exp').forEach(function (a) {
    items.push({ box: a, title: a.querySelector('.exp-text') || a, widget: a.querySelector('.cli-note,.slot,.frame') });
  });
  var active = 0, mode = 'title', visible = false;
  var s = { x: innerWidth / 2, y: innerHeight / 2, r: 300 }, v = { x: 0, y: 0, r: 0 };

  function focusWidget(i) { active = i; mode = 'widget'; }
  items.forEach(function (it, i) {
    if (!it.widget) return;
    it.widget.addEventListener('pointerdown', function () { focusWidget(i); });
    it.widget.addEventListener('focusin', function () { focusWidget(i); });
  });

  function pick() {
    var mid = innerHeight / 2, best = active, bd = 1e9;
    items.forEach(function (it, i) {
      var r = it.box.getBoundingClientRect(), d = Math.abs(r.top + r.height / 2 - mid);
      if (d < bd) { bd = d; best = i; }
    });
    if (best !== active) { active = best; mode = 'title'; } // scrolling on returns the spotlight to the next title
    items.forEach(function (it, i) { it.title.classList.toggle('retreat', i === active && mode === 'widget' && !!it.widget); });
  }
  function target() {
    var it = items[active], el = (mode === 'widget' && it.widget) ? it.widget : it.title;
    var r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2, r: Math.min(520, Math.max(170, Math.max(r.width, r.height) / 2 * 0.9 + 80)) };
  }
  function spotTick() {
    if (!visible) return;
    pick();
    var t = target();
    ['x', 'y', 'r'].forEach(function (k) {
      if (reduce) { s[k] = t[k]; return; }
      v[k] += (t[k] - s[k]) * 0.07; v[k] *= 0.8; s[k] += v[k]; // elastic rubber-band follow
    });
    vg.style.setProperty('--sx', s.x + 'px'); vg.style.setProperty('--sy', s.y + 'px'); vg.style.setProperty('--sr', s.r + 'px');
    requestAnimationFrame(spotTick);
  }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (e) {
      var on = e[0].isIntersecting;
      if (on && !visible) { visible = true; requestAnimationFrame(spotTick); }
      visible = on; vg.classList.toggle('on', on);
    }).observe(ws);
  }
})();
