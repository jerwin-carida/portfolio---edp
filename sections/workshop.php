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
    <p class="mono chapter-label">Chapter 02 &mdash; Top Secret Projects</p>
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
      <p>In the year 2024, right after making the greet program, I was soon presented with another impossible challenge. I was tasked to create a program that thinks of a random number and the user will guess it. Such a problem involves the use of the <strong>Random class, loops, and conditional statements.</strong></p>
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
      <h3>Simple Calculator</h3>
      <p class="badge mono">SUCCESS</p>
      <p>In the year 2025, when my skills have improved a little, I set out to take on another challenge. A simple calculator that takes input from a click event of a button. The task involves the use of <strong>html, css, js DOM.</strong></p>
    </div>

    <?php include 'includes/calculator.php'; ?>

    <?php mascot_note('lower-right', 'The task was challenging but provides a real experience on working with webpages.', 'assets/images/detective.webp'); ?>
  </article>

  <!-- RESERVED PROJECT SLOTS -->
  <?php
  $slots = [
    ['04','GUI Clickable Buttons — Event Listener'],
    ['05','GUI To Do List Widget — Event Listener'],
    ['06','GUI Text to Speech']
  ];

  foreach ($slots as $i => [$n, $t]): ?>
    <article class="exp <?= $i % 2 ? 'flip' : '' ?> reveal">
      <div class="exp-text">
        <span class="num"><?= $n ?></span>
        <p class="mono cat">GUI Experiment</p>
        <h3><?= $t ?></h3>
        <p class="muted">[Description to be added.]</p>
      </div>

      <div class="slot" role="img" aria-label="Reserved space for project <?= $n ?>">
        <span class="mono">reserved &mdash; <?= $n ?></span>
      </div>
    </article>
  <?php endforeach; ?>

</section>