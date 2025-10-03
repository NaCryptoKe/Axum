<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo htmlspecialchars($game['title']); ?></title>
</head>
<body>
    <h1><?php echo htmlspecialchars($game['title']); ?></h1>
    <p><strong>Description:</strong> <?php echo nl2br(htmlspecialchars($game['description'])); ?></p>

    <?php if (!empty($game['short_description'])): ?>
        <p><strong>Short:</strong> <?php echo htmlspecialchars($game['short_description']); ?></p>
    <?php endif; ?>

    <?php if (!empty($game['cover_url'])): ?>
        <img src="<?php echo htmlspecialchars($game['cover_url']); ?>" alt="Cover" width="200">
    <?php else: ?>
        <img src="./uploads/avatars/admin.jpg" alt="">
    <?php endif; ?>

    <?php if (!empty($game['file_url'])): ?>
        <p><a href="<?php echo htmlspecialchars($game['file_url']); ?>" download>⬇️ Download Game</a></p>
    <?php else: ?>
        <p>Wishlist<p>
    <?php endif; ?>
</body>
</html>