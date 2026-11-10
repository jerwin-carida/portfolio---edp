<?php
$notes = [
  ['cls' => 'n-ch2', 'href' => '#workshop', 'num' => '02',
   'title' => 'Top Secret Projects',
   'sub' => "The following are classified cat government's projects. Read at your own risk.",
   'variant' => '', 'side' => 'l'],

  ['cls' => 'n-ch3', 'href' => '#person', 'num' => '03',
   'title' => "Agent's Profile",
   'sub' => 'Skills: [REDACTED], Qualifications: [REDACTED]',
   'variant' => 'is-black', 'side' => 'r'],

  ['cls' => 'n-ch4', 'href' => '#contact', 'num' => '04',
   'title' => 'The Unfinished Chapter',
   'sub' => 'Quick, call now!',
   'variant' => '', 'side' => 'r'],
];
?>

<section id="intro" class="board-wrap" aria-labelledby="intro-h">
  <div class="board">
    <div class="stage" id="stage">
      <svg class="strings" id="strings" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"></svg>

      <?php /* Cat stickers stay in the source but are hidden visually (.sticker{display:none} in css/style.css). */ ?>


      <div class="node n-hero" data-hero>
        <div class="paper hero-note">
          <p class="mono chapter-label">Chapter 01 &mdash; Introduction</p>

          <h1 id="intro-h">Imagine it. Design it. Create it.</h1>

          <p class="lede">
            This stays between you and me. My name is <?= htmlspecialchars($siteName) ?>, and I've been assigned to several top-secret missions by the Cat Government. The details? <span class="classified">Classified.</span>
          </p>

          <a class="btn" href="#workshop">Open the Top Secret Projects &darr;</a>
        </div>

        <!-- Mascot image: empty until the asset is available -->
        <img src="../assets/images/detective.webp" class="mascot r" alt="" width="84" height="84" decoding="async">
      </div>

      <?php foreach ($notes as $n): ?>
      <a class="node <?= $n['cls'] ?>" href="<?= $n['href'] ?>" data-string>
        <span class="paper chapter-note <?= $n['variant'] ?>">
          <span class="mono cn-num"><?= $n['num'] ?></span>

          <span class="cn-title"><?= htmlspecialchars($n['title']) ?></span>

          <span class="mono muted"><?= htmlspecialchars($n['sub']) ?></span>
        </span>

        <img class="mascot <?= $n['side'] ?>" alt="" width="84" height="84" decoding="async">
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