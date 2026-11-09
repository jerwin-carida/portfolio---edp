<section id="workshop" class="chapter" aria-labelledby="work-h">
  <div class="reveal spot-intro">
    <p class="mono chapter-label">Chapter 02 &mdash; The Workshop</p>
    <h2 id="work-h">A collection of experiments</h2>
    <p class="lede">Small projects, practical applications, and one real collaboration. Try them right here on the page.</p>
  </div>

  <article class="exp reveal">
    <div class="exp-text">
      <span class="num">01</span>
      <p class="mono cat">CLI Experiment</p>
      <h3>CLI Input + Greet</h3>
      <p>Receives input and produces a response. A simulated prompt &mdash; it never runs real commands.</p>
    </div>
    <?php $cli = ['id'=>'cli-greet','tilt'=>'-1.2','label'=>'greet.sh (simulated)','prompt'=>'Enter your name:','mode'=>'text','placeholder'=>'your name','button'=>'Send','reset'=>'clear']; include 'includes/cli-note.php'; ?>
  </article>

  <article class="exp flip reveal">
    <div class="exp-text">
      <span class="num">02</span>
      <p class="mono cat">CLI Experiment</p>
      <h3>CLI Guess the Number</h3>
      <p>Input handling, conditions, and game state. Guess a number from 1 to 100.</p>
    </div>
    <?php $cli = ['id'=>'cli-guess','tilt'=>'1.4','label'=>'guess.sh (simulated)','prompt'=>'Your guess (1–100):','mode'=>'numeric','placeholder'=>'1–100','button'=>'Guess','reset'=>'new game']; include 'includes/cli-note.php'; ?>
  </article>

  <?php
  $slots = [['03','GUI Static Webpage'],['04','GUI Clickable Buttons — Event Listener'],['05','GUI To Do List Widget — Event Listener'],['06','GUI Text to Speech']];
  foreach ($slots as $i => [$n, $t]): ?>
  <article class="exp <?= $i % 2 ? '' : 'flip' ?> reveal">
    <div class="exp-text">
      <span class="num"><?= $n ?></span>
      <p class="mono cat">GUI Experiment</p>
      <h3><?= $t ?></h3>
      <p class="muted">[Description to be added.]</p>
    </div>
    <div class="slot" role="img" aria-label="Reserved space for project <?= $n ?>"><span class="mono">reserved &mdash; <?= $n ?></span></div>
  </article>
  <?php endforeach; ?>

  <article class="exp big reveal" id="lost-found">
    <span class="num">07</span>
    <p class="mono cat">Collaborative Project</p>
    <h3>GUI Lost and Found</h3>
    <p>[Purpose and major features &mdash; add confirmed project details only.]</p>
    <?php if ($lostFoundUrl): ?>
      <a class="btn" href="<?= htmlspecialchars($lostFoundUrl) ?>" target="_blank" rel="noopener noreferrer">Open the application &nearr;</a>
      <div class="frame"><iframe title="Lost and Found application preview" src="<?= htmlspecialchars($lostFoundUrl) ?>" loading="lazy"></iframe></div>
      <p class="muted">If the preview stays blank, the host may block embedding &mdash; use the button above.</p>
    <?php else: ?>
      <span class="btn off" aria-disabled="true">Launch link &mdash; URL pending</span>
      <div class="slot wide"><span class="mono">[preview / screenshot placeholder]</span></div>
    <?php endif; ?>
  </article>
</section>
