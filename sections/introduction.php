<?php
$notes = [
  ['cls' => 'n-ch2', 'href' => '#workshop', 'num' => '02',
   'title' => 'Top Secret Projects',
   'sub' => "The following are classified cat government's projects. Read at your own risk.",
   'variant' => '', 'side' => 'l', 'img' => 'assets/images/detective01.webp'],

  ['cls' => 'n-ch3', 'href' => '#person', 'num' => '03',
   'title' => "Agent's Profile",
   'sub' => 'Skills: [REDACTED], Qualifications: [REDACTED]',
   'variant' => 'is-black', 'side' => 'r', 'img' => 'assets/images/detective.webp'],

  ['cls' => 'n-ch4', 'href' => '#contact', 'num' => '04',
   'title' => 'CONTACT',
   'sub' => 'Quick, call now!',
   'variant' => '', 'side' => 'r', 'img' => 'assets/images/detective01.webp'],
];
?>

<section id="intro" class="board-wrap" aria-labelledby="intro-h">
  <div class="board">
    <div class="stage" id="stage">
      <svg class="strings" id="strings" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"></svg>

      <?php /* Cat stickers are hidden in the hero but kept in the source. To show them again, remove this comment:
      foreach ([['cat-face.svg','s1',64,64],['cat-loaf.svg','s2',80,60],['cat-sit.svg','s3',56,80],['cat-paw.svg','s4',64,64]] as [$f,$c,$w,$h]): ?>
      <img class="sticker <?= $c ?>" src="<?= asset('assets/images/stickers/' . $f) ?>" alt="" width="<?= $w ?>" height="<?= $h ?>" decoding="async">
      <?php endforeach; */ ?>


      <?php
      // Cut-out paper header: every letter is its own torn scrap of parchment (shape + texture in css/style.css).
      $cutText = strtoupper($siteName);
      $cutRot  = [-3, 2, -1.5, 3.5, -2.5, 1.5, -3.5, 2.5, -1, 3, -2, 1.5, -3];
      ?>
      <div class="node n-title">
        <p class="cutout" role="img" aria-label="<?= htmlspecialchars($siteName) ?>">
          <?php foreach (str_split($cutText) as $i => $ch): ?>
            <?php if ($ch === ' '): ?><span class="cut-gap" aria-hidden="true"></span>
            <?php else: ?><span class="cut" aria-hidden="true" style="--r:<?= $cutRot[$i % count($cutRot)] ?>deg"><?= htmlspecialchars($ch) ?></span>
            <?php endif; ?>
          <?php endforeach; ?>
        </p>
      </div>

      <div class="node n-hero" data-hero>
        <div class="paper hero-note">
          <p class="mono chapter-label">Chapter 01 &mdash; Introduction</p>

          <h1 id="intro-h">Imagine it. Design it. Create it.</h1>

          <p class="lede">
            This stays between you and me. My name is <?= htmlspecialchars($siteName) ?>, and I've been assigned to several top-secret missions by the Cat Government. The details? <span class="classified">Classified.</span>
          </p>

          <a class="btn" href="#workshop">Open the Top Secret Projects &darr;</a>
        </div>

        <!-- Hero mascot (root-relative asset URL with cache buster) -->
        <img src="<?= asset('assets/images/detective.webp') ?>" class="mascot l" alt="" width="84" height="84" decoding="async">
      </div>

      <?php foreach ($notes as $n): ?>
      <a class="node <?= $n['cls'] ?>" href="<?= $n['href'] ?>" data-string>
        <span class="paper chapter-note <?= $n['variant'] ?>">
          <span class="mono cn-num"><?= $n['num'] ?></span>

          <span class="cn-title"><?= htmlspecialchars($n['title']) ?></span>

          <span class="mono muted"><?= htmlspecialchars($n['sub']) ?></span>
        </span>

        <img class="mascot <?= $n['side'] ?>" src="<?= asset($n['img']) ?>" alt="" width="84" height="84" decoding="async">
      </a>
      <?php endforeach; ?>

      <?php /* Picture frames (polaroids) removed from the hero. */ ?>

      <p class="scroll-hint hand" aria-hidden="true">scroll to zoom in &darr;</p>
    </div>

    <?php for ($i = 0; $i < 6; $i++): ?>
    <span class="paw" aria-hidden="true">
      <svg viewBox="0 0 32 32">
        <path d="M16 17c-4 0-8 3.5-8 7 0 2.5 2 3.5 4 3.5 1.5 0 2.5-.7 4-.7s2.5.7 4 .7c2 0 4-1 4-3.5 0-3.5-4-7-8-7z"/>
        <ellipse cx="7" cy="14" rx="2.6" ry="3.4" transform="rotate(-20 7 14)"/>
        <ellipse cx="12.5" cy="8.5" rx="2.8" ry="3.8"/>
        <ellipse cx="19.5" cy="8.5" rx="2.8" ry="3.8"/>
        <ellipse cx="25" cy="14" rx="2.6" ry="3.4" transform="rotate(20 25 14)"/>
      </svg>
    </span>
    <?php endfor; ?>

  </div>
</section>