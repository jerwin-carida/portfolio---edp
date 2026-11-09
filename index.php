<?php
$siteName = 'Jerwin Carida';
$lostFoundUrl = ''; // TODO: paste the deployed Lost and Found URL here
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Interactive Field Journal — <?= htmlspecialchars($siteName) ?></title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=DM+Sans:wght@400;500&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/style.css">
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
  <script src="js/main.js" defer></script>
  <script src="js/workshop.js" defer></script>
</body>
</html>
