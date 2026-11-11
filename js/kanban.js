// Draggable Kanban board: HTML5 drag-and-drop for mouse, pointer-event fallback for touch/pen,
// lerped drop indicator + drag ghost, arrow-button keyboard alternative, localStorage persistence.
(function () {
  var root = document.getElementById('kanban');
  if (!root) return;
  var KEY = 'catgov-kanban-v1', COLS = ['todo', 'pending', 'done'];
  var NAMES = { todo: 'Not Started', pending: 'Pending', done: 'Finished' };
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  var board = document.getElementById('kb-board'), ind = document.getElementById('kb-ind');
  var live = document.getElementById('kb-live'), hint = document.getElementById('kb-hint'), form = document.getElementById('kb-add'), input = document.getElementById('kb-input');
  var lists = {}, counts = {}, storageOK = true;
  COLS.forEach(function (c) {
    lists[c] = board.querySelector('.kb-list[data-col="' + c + '"]');
    counts[c] = board.querySelector('[data-count="' + c + '"]');
  });

  // ---------- state + persistence (storage can be blocked, so everything is try/catch) ----------
  function seed() {
    return { n: 3, cols: {
      todo:    [{ id: 1, t: 'Review the mission briefing' }],
      pending: [{ id: 2, t: 'Draft the classified report' }],
      done:    [{ id: 3, t: 'Feed the Cat Government' }]
    } };
  }
  function valid(s) {
    if (!s || typeof s.n !== 'number' || !s.cols) return false;
    return COLS.every(function (c) {
      return Array.isArray(s.cols[c]) && s.cols[c].every(function (x) { return x && typeof x.id === 'number' && typeof x.t === 'string'; });
    });
  }
  function load() {
    try { var s = JSON.parse(localStorage.getItem(KEY)); if (valid(s)) return s; } catch (e) { storageOK = false; }
    return seed();
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { storageOK = false; }
    if (!storageOK) hint.textContent = 'Drag cards between columns, or use the arrow buttons. (This browser is blocking storage, so progress will not be saved.)';
  }
  var state = load();
  var landed = null, focusAfter = null;

  function say(msg) { live.textContent = ''; setTimeout(function () { live.textContent = msg; }, 30); }

  // ---------- rendering ----------
  function el(tag, cls, text) { var n = document.createElement(tag); if (cls) n.className = cls; if (text != null) n.textContent = text; return n; }
  function btn(cls, label, text, disabled) {
    var b = el('button', 'kb-btn ' + cls, text); b.type = 'button'; b.setAttribute('aria-label', label); b.disabled = !!disabled; return b;
  }
  function card(task, col) {
    var i = COLS.indexOf(col);
    var li = el('li', 'kb-card'); li.draggable = true; li.dataset.id = task.id;
    var grip = el('span', 'kb-grip', '⋮⋮'); grip.setAttribute('aria-hidden', 'true');
    li.appendChild(grip);
    li.appendChild(el('span', 'kb-text', task.t));
    var act = el('span', 'kb-actions');
    act.appendChild(btn('kb-l', 'Move "' + task.t + '" to ' + (NAMES[COLS[i - 1]] || ''), '←', i === 0));
    act.appendChild(btn('kb-r', 'Move "' + task.t + '" to ' + (NAMES[COLS[i + 1]] || ''), '→', i === COLS.length - 1));
    act.appendChild(btn('kb-x', 'Delete "' + task.t + '"', '✕'));
    li.appendChild(act);
    if (landed === task.id) li.classList.add('kb-landed');
    return li;
  }
  function render() {
    COLS.forEach(function (c) {
      var ul = lists[c]; ul.textContent = '';
      state.cols[c].forEach(function (t) { ul.appendChild(card(t, c)); });
      if (!state.cols[c].length) ul.appendChild(el('li', 'kb-empty mono', 'Drop tasks here'));
      counts[c].textContent = state.cols[c].length;
    });
    if (focusAfter) {
      var b = board.querySelector('.kb-card[data-id="' + focusAfter.id + '"] .kb-' + focusAfter.dir);
      if (!b || b.disabled) b = board.querySelector('.kb-card[data-id="' + focusAfter.id + '"] .kb-' + (focusAfter.dir === 'r' ? 'l' : 'r'));
      if (b && !b.disabled) b.focus();
    }
    landed = null; focusAfter = null;
  }

  // ---------- model operations (idx = position inside the target list WITHOUT the moving card) ----------
  function find(id) {
    for (var c = 0; c < COLS.length; c++) {
      var arr = state.cols[COLS[c]];
      for (var i = 0; i < arr.length; i++) if (arr[i].id === id) return { col: COLS[c], i: i, task: arr[i] };
    }
    return null;
  }
  function move(id, toCol, idx) {
    var f = find(id); if (!f) return;
    state.cols[f.col].splice(f.i, 1);
    var arr = state.cols[toCol];
    idx = Math.max(0, Math.min(idx, arr.length));
    arr.splice(idx, 0, f.task);
    landed = id; save(); render();
    say('Moved "' + f.task.t + '" to ' + NAMES[toCol] + '.');
  }
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var t = input.value.trim(); if (!t) { input.focus(); return; }
    state.n += 1; state.cols.todo.push({ id: state.n, t: t.slice(0, 80) });
    input.value = ''; landed = state.n; save(); render(); say('Added "' + t + '" to Not Started.');
  });
  board.addEventListener('click', function (e) {
    var b = e.target.closest('.kb-btn'); if (!b) return;
    var li = b.closest('.kb-card'), id = +li.dataset.id, f = find(id); if (!f) return;
    var i = COLS.indexOf(f.col);
    if (b.classList.contains('kb-x')) { state.cols[f.col].splice(f.i, 1); save(); render(); say('Deleted "' + f.task.t + '".'); return; }
    var dir = b.classList.contains('kb-l') ? 'l' : 'r', to = COLS[i + (dir === 'l' ? -1 : 1)];
    if (to) { focusAfter = { id: id, dir: dir }; move(id, to, state.cols[to].length); }
  });

  // ---------- drop indicator + ghost, eased with lerp in ONE rAF loop that sleeps when settled ----------
  var tgt = { x: 0, y: 0, w: 100 }, cur = { x: 0, y: 0, w: 100 }, indOn = false;
  var ghost = null, gT = { x: 0, y: 0 }, gC = { x: 0, y: 0 }, raf = 0, last = 0;
  function tick(now) {
    raf = 0;
    var dt = Math.max(1, Math.min(now - last, 50)), k = reduce ? 1 : 1 - Math.pow(1 - 0.3, dt / 16.67), busy = false;
    last = now;
    if (indOn) {
      cur.x += (tgt.x - cur.x) * k; cur.y += (tgt.y - cur.y) * k; cur.w += (tgt.w - cur.w) * k;
      ind.style.transform = 'translate3d(' + cur.x + 'px,' + cur.y + 'px,0) scale3d(' + cur.w / 100 + ',1,1)';
      if (Math.abs(tgt.x - cur.x) + Math.abs(tgt.y - cur.y) + Math.abs(tgt.w - cur.w) > 0.3) busy = true;
    }
    if (ghost) {
      var gk = reduce ? 1 : 1 - Math.pow(1 - 0.4, dt / 16.67), dx = (gT.x - gC.x) * gk;
      gC.x += dx; gC.y += (gT.y - gC.y) * gk;
      var tilt = Math.max(-4, Math.min(4, dx * 0.4));
      ghost.style.transform = 'translate3d(' + gC.x + 'px,' + gC.y + 'px,0) rotate3d(0,0,1,' + tilt + 'deg)';
      busy = true;                                   // keep following until the finger lifts
    }
    if (busy) raf = requestAnimationFrame(tick);
  }
  function wake() { if (!raf) { last = performance.now(); raf = requestAnimationFrame(tick); } }

  var hoverList = null, hoverIdx = 0, dragId = null;
  function cardsIn(list) { return [].slice.call(list.querySelectorAll('.kb-card:not(.is-dragging)')); }
  function indexFor(list, y) {
    var cs = cardsIn(list);
    for (var i = 0; i < cs.length; i++) { var r = cs[i].getBoundingClientRect(); if (y < r.top + r.height / 2) return i; }
    return cs.length;
  }
  function showIndicator(list, idx) {
    var br = board.getBoundingClientRect(), lr = list.getBoundingClientRect(), cs = cardsIn(list), y;
    if (idx < cs.length) y = cs[idx].getBoundingClientRect().top - 4;
    else if (cs.length) y = cs[cs.length - 1].getBoundingClientRect().bottom + 4;
    else y = lr.top + 6;
    tgt.x = lr.left - br.left; tgt.y = y - br.top - 2; tgt.w = lr.width;
    if (!indOn) { cur.x = tgt.x; cur.y = tgt.y; cur.w = tgt.w; indOn = true; ind.style.transform = 'translate3d(' + cur.x + 'px,' + cur.y + 'px,0) scale3d(' + cur.w / 100 + ',1,1)'; }
    ind.classList.add('on'); wake();
  }
  function hideIndicator() { indOn = false; ind.classList.remove('on'); }
  function setHover(list, idx) {
    if (hoverList !== list) {
      if (hoverList) hoverList.parentNode.classList.remove('is-over');
      if (list) list.parentNode.classList.add('is-over');
    }
    hoverList = list; hoverIdx = idx;
    if (list) showIndicator(list, idx); else hideIndicator();
  }
  function endDrag() {
    var d = board.querySelector('.is-dragging'); if (d) d.classList.remove('is-dragging');
    setHover(null, 0); dragId = null;
  }
  function listAt(x, y) {
    var t = document.elementFromPoint(x, y), col = t && t.closest ? t.closest('.kb-col') : null;
    return col ? col.querySelector('.kb-list') : null;
  }

  // ---------- mouse: native HTML5 drag and drop ----------
  var lastType = 'mouse';
  board.addEventListener('pointerdown', function (e) { lastType = e.pointerType || 'mouse'; }, true);
  board.addEventListener('dragstart', function (e) {
    var c = e.target.closest ? e.target.closest('.kb-card') : null; if (!c) return;
    if (lastType !== 'mouse') { e.preventDefault(); return; }              // touch/pen use the fallback below
    dragId = +c.dataset.id;
    e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', String(dragId));
    requestAnimationFrame(function () { c.classList.add('is-dragging'); });
  });
  board.addEventListener('dragover', function (e) {
    if (dragId == null) return;
    var col = e.target.closest('.kb-col'); if (!col) return;
    e.preventDefault(); e.dataTransfer.dropEffect = 'move';
    var list = col.querySelector('.kb-list'); setHover(list, indexFor(list, e.clientY));
  });
  board.addEventListener('dragleave', function (e) { if (!board.contains(e.relatedTarget)) setHover(null, 0); });
  board.addEventListener('drop', function (e) {
    if (dragId == null || !hoverList) return;
    e.preventDefault();
    var id = dragId, to = hoverList.dataset.col, idx = hoverIdx;
    endDrag(); move(id, to, idx);
  });
  board.addEventListener('dragend', endDrag);

  // ---------- touch / pen: pointer-event fallback with a lerped ghost ----------
  board.addEventListener('pointerdown', function (e) {
    if (e.pointerType === 'mouse') return;
    var grip = e.target.closest('.kb-grip'); if (!grip) return;
    var c = grip.closest('.kb-card'), r = c.getBoundingClientRect();
    e.preventDefault();
    dragId = +c.dataset.id;
    ghost = c.cloneNode(true); ghost.classList.add('kb-ghost'); ghost.removeAttribute('draggable');
    ghost.style.width = r.width + 'px'; document.body.appendChild(ghost);
    var ox = e.clientX - r.left, oy = e.clientY - r.top;
    gC.x = gT.x = r.left; gC.y = gT.y = r.top;
    c.classList.add('is-dragging');
    try { grip.setPointerCapture(e.pointerId); } catch (err) {}
    function mv(ev) {
      gT.x = ev.clientX - ox; gT.y = ev.clientY - oy;
      var l = listAt(ev.clientX, ev.clientY);
      setHover(l, l ? indexFor(l, ev.clientY) : 0);
      if (ev.clientY < 70) window.scrollBy(0, -12); else if (ev.clientY > innerHeight - 70) window.scrollBy(0, 12);
      wake();
    }
    function up() {
      grip.removeEventListener('pointermove', mv); grip.removeEventListener('pointerup', up); grip.removeEventListener('pointercancel', cancel);
      var id = dragId, to = hoverList && hoverList.dataset.col, idx = hoverIdx;
      if (ghost) { ghost.remove(); ghost = null; }
      endDrag(); if (to) move(id, to, idx);
    }
    function cancel() { setHover(null, 0); up(); }
    grip.addEventListener('pointermove', mv); grip.addEventListener('pointerup', up); grip.addEventListener('pointercancel', cancel);
    wake();
  });

  render();
})();
