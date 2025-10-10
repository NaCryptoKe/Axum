<?php
$basePath = $basePath ?? '/sxumarcade/public';
$games = $games ?? [];
$users = $users ?? [];

$error = $_GET['error'] ?? null;
$message = $_GET['message'] ?? null;

$searchQuery = htmlspecialchars(trim($_GET['q'] ?? ''));

require_once __DIR__ . '/../../app/helpers/auth.php';
$currentUserId = currentUserId();
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Search Results for "<?= $searchQuery ?>" - AxumArcade</title>

  <link rel="stylesheet" href="<?= $basePath ?>/assets/css/reset.css">
  <link rel="stylesheet" href="<?= $basePath ?>/assets/css/theme.css">
  <link rel="stylesheet" href="<?= $basePath ?>/assets/css/layout.css">
  <link rel="stylesheet" href="<?= $basePath ?>/assets/css/cards.css">
  <link rel="stylesheet" href="<?= $basePath ?>/assets/css/results-inline.css">
  <link rel="icon" type="image/svg+xml" href="<?= $basePath ?>/assets/img/LOGO.svg">
</head>

<body>
  <?php include __DIR__ . '/../layout/header.php'; // Assuming header.php handles the top bar ?>

  <main>
    <?php include '../views/layout/side-bar.php'; ?>

    <div class="content">
      <div class="page-header">
        <h1>Search Results</h1>
        <p>Found results for: "<strong><?= $searchQuery ?></strong>"</p>
      </div>

      <?php if (!empty($error)): ?>
        <div class="error-message"><?= htmlspecialchars($error) ?></div>
      <?php endif; ?>

      <?php if (!empty($message)): ?>
        <div class="success-message"><?= htmlspecialchars($message) ?></div>
      <?php endif; ?>

      <div class="results-section">
        <h2 class="results-title">Games (<?= count($games) ?>)</h2>
        <div class="horizontal-scroll">
          <?php if (!empty($games)): ?>
            <?php foreach ($games as $game): ?>
              <div class="result-card">
                <a href="<?= $basePath ?>/game/<?= $game['id'] ?>">
                  <img 
                    src="<?= htmlspecialchars($game['cover_url'] ?? $basePath . '/assets/img/default-cover.jpg') ?>" 
                    alt="<?= htmlspecialchars($game['title']) ?>"
                  >
                  <div class="card-title"><?= htmlspecialchars($game['title']) ?></div>
                </a>
              </div>
            <?php endforeach; ?>
          <?php else: ?>
            <p class="empty-state">No games found matching "<?= $searchQuery ?>".</p>
          <?php endif; ?>
        </div>
      </div>

      <div class="results-section">
        <h2 class="results-title">Users (<?= count($users) ?>)</h2>
        <div class="horizontal-scroll">
          <?php if (!empty($users)): ?>
            <?php foreach ($users as $user): ?>
              <div class="result-card">
                <a href="<?= $basePath ?>/@<?= htmlspecialchars($user['username']) ?>">
                  <img 
                    src="<?= htmlspecialchars($user['avatar_url'] ?? $basePath . '/assets/img/default-avatar.jpg') ?>" 
                    alt="<?= htmlspecialchars($user['username']) ?>'s Avatar"
                    class="user-avatar"
                  >
                  <div class="card-title"><?= htmlspecialchars($user['username']) ?></div>
                </a>
              </div>
            <?php endforeach; ?>
          <?php else: ?>
            <p class="empty-state">No users found matching "<?= $searchQuery ?>".</p>
          <?php endif; ?>
        </div>
      </div>
    </div>
  </main>
</body>
</html>