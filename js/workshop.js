// Shared simulated-CLI helper. Each call keeps its own state; nothing is ever executed.
function makeCli(root, onSubmit, onStart) {
  var out = root.querySelector('.cli-out');
  var form = root.querySelector('form');
  var input = root.querySelector('input');
  var cli = {
    print: function (text, cls) {
      var p = document.createElement('p');
      p.textContent = text; // textContent: user input is never parsed as HTML
      if (cls) p.className = cls;
      out.appendChild(p);
      out.scrollTop = out.scrollHeight;
    },
    clear: function () { out.textContent = ''; }
  };
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var v = input.value.trim();
    input.value = '';
    cli.print('> ' + (v || '(empty)'), 'echo');
    onSubmit(v, cli);
    input.focus();
  });
  root.querySelector('[data-reset]').addEventListener('click', function () {
    cli.clear(); onStart(cli); input.focus();
  });
  onStart(cli);
}

document.addEventListener('DOMContentLoaded', function () {
  // 01 Greet
  makeCli(document.getElementById('cli-greet'),
    function (name, cli) {
      if (!name) return cli.print('! Please type a name first.', 'err');
      cli.print('Hello, ' + name + '! Welcome to the field journal.');
    },
    function (cli) { cli.print('What is your name?'); });

  // 02 Guess the number (state is private to this closure)
  var secret, tries, done;
  function newGame(cli) {
    secret = Math.floor(Math.random() * 100) + 1; tries = 0; done = false;
    cli.print('I picked a number from 1 to 100. Can you guess it?');
  }
  makeCli(document.getElementById('cli-guess'),
    function (v, cli) {
      if (done) return cli.print('Round over. Press "new game" to play again.');
      if (!/^-?\d+$/.test(v)) return cli.print('! Enter a whole number.', 'err');
      var n = parseInt(v, 10);
      if (n < 1 || n > 100) return cli.print('! Stay between 1 and 100.', 'err');
      tries++;
      if (n < secret) cli.print('Too low.');
      else if (n > secret) cli.print('Too high.');
      else { done = true; cli.print('Correct! You got it in ' + tries + (tries === 1 ? ' try.' : ' tries.')); }
    },
    newGame);

  // 03 Simple calculator (click events only; no eval)
  var calc = document.getElementById('calc');
  if (calc) {
    var screen = document.getElementById('calc-screen'), exprEl = document.getElementById('calc-expr');
    var cur = '0', prev = null, op = null, fresh = false, dead = false;
    var sym = { '+': '+', '-': '\u2212', '*': '\u00d7', '/': '\u00f7' };
    function fmt(n) { return String(parseFloat(n.toPrecision(12))); }
    function compute(a, o, b) {
      if (o === '+') return a + b; if (o === '-') return a - b; if (o === '*') return a * b;
      return b === 0 ? NaN : a / b;
    }
    function render() {
      screen.textContent = cur;
      exprEl.textContent = op ? fmt(prev) + ' ' + sym[op] : '\u00a0';
    }
    function reset() { cur = '0'; prev = null; op = null; fresh = false; dead = false; }
    function press(k) {
      if (dead) reset();
      if (/^\d$/.test(k)) {
        if (fresh) { cur = k; fresh = false; }
        else if (cur.replace(/[-.]/g, '').length < 12) cur = cur === '0' ? k : cur + k;
      } else if (k === '.') {
        if (fresh) { cur = '0.'; fresh = false; } else if (cur.indexOf('.') < 0) cur += '.';
      } else if (k === 'C') { reset(); }
      else if (k === 'del') { if (!fresh) cur = cur.length > 1 && cur !== '-0' ? cur.slice(0, -1) : '0'; }
      else if (k === '=') {
        if (op !== null && !fresh) {
          var r = compute(prev, op, parseFloat(cur));
          if (!isFinite(r)) { cur = 'Error'; dead = true; } else cur = fmt(r);
          prev = null; op = null; fresh = true;
        }
      } else {                                   // + - * /
        if (op !== null && !fresh) {
          var r2 = compute(prev, op, parseFloat(cur));
          if (!isFinite(r2)) { cur = 'Error'; dead = true; prev = null; op = null; render(); return; }
          prev = r2; cur = fmt(r2);
        } else prev = parseFloat(cur);
        op = k; fresh = true;
      }
      render();
    }
    calc.querySelector('.calc-keys').addEventListener('click', function (e) {
      var b = e.target.closest('button[data-k]');
      if (b) press(b.getAttribute('data-k'));
    });
    render();
  }
});
