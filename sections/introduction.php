<?php
// Detective-board hero. Chapter notes are pinned to the board; red strings are drawn by js/board.js.
$notes = [
  ['n-ch2', '#workshop', '02', 'The Workshop', 'Experiments you can try'],
  ['n-ch3', '#person',   '03', 'The Person Behind the Code', 'Interests and philosophy'],
  ['n-ch4', '#contact',  '04', 'The Unfinished Chapter', 'Say hello'],
];
?>
<section id="intro" class="board-wrap" aria-labelledby="intro-h">
  <div class="board">
    <div class="stage" id="stage">
      <svg class="strings" id="strings" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"></svg>

      <div class="node n-hero" data-hero>
        <div class="paper hero-note">
          <p class="mono chapter-label">Chapter 01 &mdash; Introduction</p>
          <h1 id="intro-h">Imagine. Design. Create.</h1>
          <p class="lede">Hi, I'm <?= htmlspecialchars($siteName) ?>. [One or two sentences about who you are and what you build &mdash; replace with your own words.]</p>
          <a class="btn" href="#workshop">Open the Workshop &darr;</a>
        </div>
      </div>

      <?php foreach ($notes as [$cls, $href, $num, $title, $sub]): ?>
      <a class="node <?= $cls ?>" href="<?= $href ?>" data-string>
        <span class="paper chapter-note">
          <span class="mono cn-num"><?= $num ?></span>
          <span class="cn-title"><?= $title ?></span>
          <span class="mono muted"><?= $sub ?></span>
        </span>
      </a>
      <?php endforeach; ?>

      <?php foreach (['n-a1', 'n-a2'] as $i => $cls): ?>
      <div class="node <?= $cls ?>" data-string>
        <div class="paper polaroid">
          <div class="ph" role="img" aria-label="Placeholder for a personal photo <?= $i + 1 ?>"></div>
          <span class="hand">[your photo]</span>
        </div>
      </div>
      <?php endforeach; ?>

      <p class="scroll-hint hand" aria-hidden="true">scroll to zoom in &darr;</p>
    </div>
  </div>
</section>
