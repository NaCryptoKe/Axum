<?php
// views/game/checkout.php

$basePath = $basePath ?? '/sxumarcade/public';

if (!isset($gameData)) {
    header("Location: {$basePath}/games");
    exit;
}
?>
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Checkout: <?= htmlspecialchars($gameData['title']) ?> - AxumArcade</title>

  <link rel="stylesheet" href="<?= $basePath ?>/assets/css/reset.css">
  <link rel="stylesheet" href="<?= $basePath ?>/assets/css/theme.css">
  <link rel="stylesheet" href="<?= $basePath ?>/assets/css/layout.css">
  <link rel="stylesheet" href="<?= $basePath ?>/assets/css/checkout-style.css"> 
  <link rel="icon" type="image/svg+xml" href="<?= $basePath ?>/assets/img/LOGO.svg">
  
</head>
<body>
  <div class="checkout-container">
    <h1>Final Step: Checkout</h1>

    <div class="game-summary">
      <img 
        src="<?= htmlspecialchars($gameData['cover_url'] ?? $basePath . '/assets/img/default-cover.jpg') ?>" 
        alt="Game Cover" 
        class="game-cover-small"
      >
      <div>
        <h2><?= htmlspecialchars($gameData['title']) ?></h2>
        <p>By <?= htmlspecialchars($gameData['developer_username'] ?? 'Unowned') ?></p>
      </div>
    </div>

    <div class="total-amount">
      Amount Due: $<?= number_format($gameData['price'], 2) ?>
    </div>

    <p class="checkout-instruction">
      Click <strong>Confirm Payment</strong> to mark this game as purchased.  
      (This is a test checkout — no Telebirr proof required.)
    </p>

    <form action="<?= $basePath ?>/process_payment" method="POST">
      <input type="hidden" name="game_id" value="<?= htmlspecialchars($gameData['id']) ?>">
      <div class="form-actions">
          <a href="<?= $basePath ?>/game/<?= $gameData['id'] ?>" class="btn-secondary">Cancel</a>
          <button type="submit" class="btn-primary">Confirm Payment</button>
      </div>
    </form>
  </div>
</body>
</html>