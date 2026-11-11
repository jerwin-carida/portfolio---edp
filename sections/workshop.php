<?php
function mascot_note(string $placement, string $msg, string $source): void { ?>
    <figure class="mascot-note <?= htmlspecialchars($placement) ?>">
      <img
        src="<?= asset($source) ?>"
        class="pm"
        alt="Portfolio mascot"
        width="72"
        height="72"
        loading="lazy"
        decoding="async"
      >
      <figcaption class="bubble">
        <?= htmlspecialchars($msg) ?>
      </figcaption>
    </figure>
<?php } ?>

<section id="workshop" class="chapter" aria-labelledby="work-h">
  <div class="reveal spot-intro">
    <p class="mono chapter-label">Chapter 02: Top Secret Projects</p>
    <h2 id="work-h">Top Secret Projects</h2>
    <p class="lede">The contents below details the creation and implementation of the projects of the cat government. These are highly classified, do not leak anything!</p>
  </div>

  <!-- PROJECT 01 -->
  <article class="exp reveal">
    <div class="exp-text">
      <span class="num">01</span>
      <h3>Greetings</h3>
      <p class="badge mono">SUCCESS</p>
      <p>In the year 2024, I started learning Java Programming and the very first program I made was a simple <strong>print</strong> of greet.</p>
    </div>

    <?php
    $cli = [
      'id'=>'cli-greet',
      'tilt'=>'-1.2',
      'label'=>'greet.sh (simulated) Java',
      'prompt'=>'Enter your name:',
      'mode'=>'text',
      'placeholder'=>'your name',
      'button'=>'Send',
      'reset'=>'clear'
    ];
    include 'includes/cli-note.php';
    ?>

    <?php mascot_note('lower-right', 'The task was easy as expected', 'assets/images/detective.webp'); ?>
  </article>

  <!-- PROJECT 02 -->
  <article class="exp reveal">
    <div class="exp-text">
      <span class="num">02</span>
      <h3>Guess The Number</h3>
      <p class="badge mono">SUCCESS</p>
      <p>In the year 2024, right after making the greet program,I was soon presented with another impossible challenge. He was tasked to create a program that thinks of a random number and the user will guess it. Such a problem involves the use of the <strong>Random class, loops, and conditional statements.</strong></p>
    </div>

    <?php
    $cli = [
      'id'=>'cli-guess',
      'tilt'=>'1.4',
      'label'=>'guess.sh (simulated) Java',
      'prompt'=>'Your guess (1–100):',
      'mode'=>'numeric',
      'placeholder'=>'1–100',
      'button'=>'Guess',
      'reset'=>'new game'
    ];
    include 'includes/cli-note.php';
    ?>

    <?php mascot_note('lower-left', 'The task was challenging for the pledging programmer, but he accomplished it with great difficulty.', 'assets/images/detective01.webp'); ?>
  </article>

  <!-- PROJECT 03 -->
  <article class="exp reveal">
    <div class="exp-text">
      <span class="num">03</span>
      <h3>GUI Static Webpage - Simple Calculator</h3>
      <p class="badge mono">Seal of Approval: SUCCESS</p>
      <p>In the year 2025, when his skills have improved a little, he set out to take on another challenge. A simple calculator that takes input from a click event of a button. The task involves the use of <strong>html, css, js DOM.</strong></p>
    </div>

    <?php include 'includes/calculator.php'; ?>

    <?php mascot_note('lower-right', 'The task was challenging but provides a real experience on working with webpages.', 'assets/images/detective.webp'); ?>
  </article>

  <!-- PROJECT 04: Draggable To-Do List (Kanban Board) -->
  <article class="exp exp-wide reveal">
    <div class="exp-text">
      <span class="num">04</span>
      <h3>Draggable To-Do List (Kanban Board)</h3>
      <p class="badge mono">SUCCESS</p>
      <p>In the year 2026, I started practicing API and I manage to create a simple kanban board with draggable cards.</p>
    </div>

    <?php include 'includes/kanban.php'; ?>

    <?php mascot_note('lower-right', 'HA! The agent can finally utilized the power of API!', 'assets/images/detective01.webp'); ?>
  </article>

  <!-- PROJECT 05: GUI Text to Speech (iframe styled as a taped photo) -->
  <?php
  // TODO: point this at the hosted Text to Speech page (relative path or full URL).
  $ttsSrc = 'about:blank';

  $slots = [
    ['05', 'E Commerce Website']
  ];

  foreach ($slots as $i => [$n, $t]): ?>
    <article class="exp <?= $i % 2 ? 'flip' : '' ?> reveal">
      <div class="exp-text">
        <span class="num"><?= $n ?></span>
        <p class="mono cat">KEI CREME</p>
        <h3><?= $t ?></h3>
        <p class="muted">[Description to be added.]</p>
      </div>

      <figure class="photo" style="--tilt:<?= $i % 2 ? '1.4' : '-1.6' ?>deg">
        <div class="photo-frame">
          <iframe
            src="https://keicreme1.netlify.app/"
            title="<?= htmlspecialchars($t) ?> (project <?= $n ?>)"
            loading="lazy"
            referrerpolicy="no-referrer"
            allow="autoplay"></iframe>
        </div>
        <figcaption class="photo-cap hand">tts.html (live)</figcaption>
      </figure>
    </article>
  <?php endforeach; ?>

</section>