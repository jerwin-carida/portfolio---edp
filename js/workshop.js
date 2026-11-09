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
});
