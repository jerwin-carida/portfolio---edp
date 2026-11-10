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

      <?php foreach ([['cat-face.svg','s1',64,64],['cat-loaf.svg','s2',80,60],['cat-sit.svg','s3',56,80],['cat-paw.svg','s4',64,64]] as [$f,$c,$w,$h]): ?>
      <img class="sticker <?= $c ?>" src="assets/images/stickers/<?= $f ?>" alt="" width="<?= $w ?>" height="<?= $h ?>" decoding="async" loading="lazy">
      <?php endforeach; ?>

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
    <?php for ($i = 0; $i < 6; $i++): ?>
    <span class="paw" aria-hidden="true"><svg viewBox="0 0 32 32"><path d="M16 17c-4 0-8 3.5-8 7 0 2.5 2 3.5 4 3.5 1.5 0 2.5-.7 4-.7s2.5.7 4 .7c2 0 4-1 4-3.5 0-3.5-4-7-8-7z"/><ellipse cx="7" cy="14" rx="2.6" ry="3.4" transform="rotate(-20 7 14)"/><ellipse cx="12.5" cy="8.5" rx="2.8" ry="3.8"/><ellipse cx="19.5" cy="8.5" rx="2.8" ry="3.8"/><ellipse cx="25" cy="14" rx="2.6" ry="3.4" transform="rotate(20 25 14)"/></svg></span>
    <?php endfor; ?>
  </div>
</section>
