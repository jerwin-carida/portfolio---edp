// Contact form: validates, sends with fetch(), and keeps the page where it is. Without JS the form posts normally.
(function () {
  var f = document.getElementById('contact-form');
  if (!f || !window.fetch) return;
  var st = document.getElementById('cf-status'), btn = f.querySelector('button[type="submit"]'), el = f.elements;
  function say(msg, ok) { st.textContent = msg; st.className = 'form-status mono ' + (ok ? 'ok' : 'err'); }

  f.addEventListener('submit', function (e) {
    e.preventDefault();
    var name = el.name.value.trim(), email = el.email.value.trim(), msg = el.message.value.trim();
    if (!name) { say('Please enter your name.'); el.name.focus(); return; }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) { say('Please enter a valid email address.'); el.email.focus(); return; }
    if (msg.length < 10) { say('Your message needs at least 10 characters.'); el.message.focus(); return; }

    btn.disabled = true; say('Sending…', true);
    fetch(f.action, { method: 'POST', body: new FormData(f), headers: { 'Accept': 'application/json' }, credentials: 'same-origin' })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        say(d.message || 'Something went wrong.', !!d.ok);
        if (d.ok) f.reset();
      })
      .catch(function () { say('Could not send right now. Please email jerwincarida06@gmail.com instead.'); })
      .then(function () { btn.disabled = false; });
  });
})();
