<?php
$siteName = 'Jerwin Carida';

// Root-relative asset URL + modification-time cache buster (works at the domain root or in a subfolder).
$base = rtrim(str_replace('\\', '/', dirname($_SERVER['SCRIPT_NAME'] ?? '')), '/');
function asset(string $path): string {
  global $base;
  $file = __DIR__ . '/' . $path;
  $v = is_file($file) ? filemtime($file) : time();
  return $base . '/' . $path . '?v=' . $v;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title><?= htmlspecialchars($siteName) ?>'s Portfolio</title>
  <link rel="stylesheet" href="<?= asset('css/style.css') ?>">
  <!--ERUDA DEBUGGING PARA SA PISTING YAWA NA COOKIE-->
  <script>
    if (new URLSearchParams(location.search).has('debug')) {
        const script = document.createElement('script');

        script.src = 'https://cdn.jsdelivr.net/npm/eruda';

        script.onload = () => eruda.init();

        document.head.appendChild(script);
    }
  </script>
  <script>document.documentElement.classList.add('js');</script>
</head>
<body>
  <a class="skip" href="#main">Skip to content</a>
  <?php include 'includes/navbar.php'; ?>
  <main id="main">
    <?php include 'sections/introduction.php'; ?>
    <?php include 'sections/workshop.php'; ?>
    <?php include 'sections/about.php'; ?>
    <?php include 'sections/contact.php'; ?>
  </main>
  <?php include 'includes/footer.php'; ?>
  <script src="<?= asset('js/main.js') ?>" defer></script>
  <script src="<?= asset('js/workshop.js') ?>" defer></script>
  <script src="<?= asset('js/board.js') ?>" defer></script>
  <script src="<?= asset('js/contact.js') ?>" defer></script>
  <script src="<?= asset('js/kanban.js') ?>" defer></script>
</body>
</html>
