<?php
// views/library/index.php
$basePath = $basePath ?? '/sxumarcade/public';
$page = $_GET['tab'] ?? 'purchased';

$userData = $userData ?? [];
$isOwnLibrary = true;
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Library - AxumArcade</title>

  <link rel="icon" type="image/svg+xml" href="<?= $basePath ?>/assets/img/LOGO.svg">
  <link rel="stylesheet" href="<?= $basePath ?>/assets/css/reset.css">
  <link rel="stylesheet" href="<?= $basePath ?>/assets/css/theme.css">
  <link rel="stylesheet" href="<?= $basePath ?>/assets/css/layout.css">
  <link rel="stylesheet" href="<?= $basePath ?>/assets/css/profile.css">
  <link rel="stylesheet" href="<?= $basePath ?>/assets/css/cards.css">
  <link rel="stylesheet" href="<?= $basePath ?>/assets/css/library.css">
</head>

<body>
  <?php include __DIR__ . '/../layout/header.php'; ?>

  <main>
    <?php include __DIR__ . '/../layout/side-bar.php'; ?>

    <div class="content">
      <div class="profile-header">
        <div class="profile-info">
          <h1>📚 My Library</h1>
          <p>Manage your purchased games and your uploaded games</p>
        </div>
      </div>

      <!-- Tabs Navigation -->
      <nav class="profile-nav">
        <a href="<?= $basePath ?>/library?tab=purchased" class="nav-item <?= $page === 'purchased' ? 'active' : '' ?>">Purchased Games</a>
        <a href="<?= $basePath ?>/library?tab=uploaded" class="nav-item <?= $page === 'uploaded' ? 'active' : '' ?>">Your Games</a>
      </nav>

      <div class="profile-content">
        <?php if ($page === 'purchased'): ?>
          <h2>Purchased Games</h2>
          <?php if (!empty($games['purchased'])): ?>
            <div class="library-list">
              <?php foreach ($games['purchased'] as $game): ?>
                <div class="game-card">
                  <img src="<?= htmlspecialchars($game['cover_url']) ?>" alt="<?= htmlspecialchars($game['title']) ?>">
                  <div class="game-info">
                    <h3><?= htmlspecialchars($game['title']) ?></h3>
                    <p><?= htmlspecialchars($game['short_description']) ?></p>
                    <a href="<?= $basePath ?>/game/<?= $game['id'] ?>" class="btn btn-primary">View Game</a>
                  </div>
                </div>
              <?php endforeach; ?>
            </div>
          <?php else: ?>
            <p>You haven’t purchased any games yet. <a href="<?= $basePath ?>/games">Browse Games</a></p>
          <?php endif; ?>

        <?php elseif ($page === 'uploaded'): ?>
          <h2>Your Uploaded Games</h2>
          <?php if (!empty($games['uploaded'])): ?>
            <div class="library-list">
              <?php foreach ($games['uploaded'] as $game): ?>
                <div class="game-card">
                  <img src="<?= htmlspecialchars($game['cover_url']) ?>" alt="<?= htmlspecialchars($game['title']) ?>">
                  <div class="game-info">
                    <h3><?= htmlspecialchars($game['title']) ?></h3>
                    <p><?= htmlspecialchars($game['short_description']) ?></p>
                    <a href="<?= $basePath ?>/game/<?= $game['id'] ?>" class="btn btn-primary">View Game</a>
                  </div>
                </div>
              <?php endforeach; ?>
            </div>
          <?php else: ?>
            <p>You haven’t uploaded any games yet. <a href="<?= $basePath ?>/game/create">Upload a Game</a></p>
          <?php endif; ?>
        <?php endif; ?>
      </div>
    </div>
  </main>
</body>
</html>
