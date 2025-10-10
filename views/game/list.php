<?php
$basePath = '/sxumarcade/public';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Browse Games - AxumArcade</title>
    <link rel="stylesheet" href="<?= $basePath ?>/assets/css/theme.css">
    <link rel="stylesheet" href="<?= $basePath ?>/assets/css/layout.css">
    <link rel="stylesheet" href="<?= $basePath ?>/assets/css/reset.css">
    <link rel="stylesheet" href="<?= $basePath ?>/assets/css/browse.css">
  <link rel="stylesheet" href="<?= $basePath ?>/assets/css/cards.css">
    <link rel="icon" type="image/svg+xml" href="<?= $basePath ?>/assets/img/LOGO.svg">
  
</head>
<body>
    <?php 
        $userController = new UserController();
        $userController->header();
    ?>
    
    <main>
        <?php include __DIR__ . '/../layout/side-bar.php'; ?>
        
        <div class="content">
            <div class="page-header">
                <h1>Browse Games</h1>
                <p>Discover amazing games from our community</p>
            </div>

            <?php if (empty($games)): ?>
                <div class="empty-state">
                    <div class="empty-icon">🎮</div>
                    <h2>No Games Yet</h2>
                    <p>It looks like no games have been uploaded or approved yet. Check back soon!</p>
                </div>
            <?php else: ?>
                <div class="game-list">
                    <?php foreach ($games as $game): ?>
                        <div class="game-row">
                            <div class="game-cover-small">
                                <?php if (!empty($game['cover_url'])): ?>
                                    <img src="<?= htmlspecialchars($game['cover_url']) ?>" alt="<?= htmlspecialchars($game['title']) ?>">
                                <?php else: ?>
                                    <div class="cover-placeholder">🎮</div>
                                <?php endif; ?>
                            </div>
                            <div class="game-info">
                                <h3 class="game-title"><a href="<?= $basePath ?>/game/<?= $game['id'] ?>"><?= htmlspecialchars($game['title']) ?></a></h3>
                                <p class="game-description"><?= htmlspecialchars($game['short_description'] ?? $game['description']) ?></p>
                                <div class="game-meta">
                                    <span class="game-price">
                                        <?= $game['price'] > 0 ? 'ETB' . number_format($game['price'], 2) : 'Free' ?>
                                    </span>
                                    <span class="game-downloads">
                                        📥 <?= $game['download_count'] ?> downloads
                                    </span>
                                </div>
                                <a href="<?= $basePath ?>/game/<?= $game['id'] ?>" class="btn-view-game">
                                    View Game
                                </a>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            <?php endif; ?>
        </div>
    </main>
</body>
</html>