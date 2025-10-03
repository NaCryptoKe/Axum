<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Axum Arcade</title>
</head>
<body>
    <h1>Approved Games</h1>

    <?php if (empty($games)): ?>
        <p>No games found.</p>
    <?php else: ?>
        <ul>
            <?php foreach ($games as $game): ?>
                <li>
                    <a href="/SxumArcade/public/view_game.php?id=<?php echo $game['id']; ?>">
                        <?php echo htmlspecialchars($game['title']); ?>
                    </a>
                    <?php if (!empty($game['short_description'])): ?>
                        - <?php echo htmlspecialchars($game['short_description']); ?>
                    <?php endif; ?>
                    (Downloads: <?php echo $game['download_count']; ?>)
                    <?php if(!empty($game['cover_url'])): ?>
                        <br>
                        <img src="<?php echo htmlspecialchars($game['cover_url']); ?>" alt="Cover" width="100">
                    <?php endif; ?>
                    <?php if ($game['price'] > 0): ?>
                        <p>- Price: $<?php echo  number_format($game['price'], 2); ?></p>
                    <?php else: ?>
                        <p>- Free</p>
                    <?php endif; ?>
                    <p>Rating: <?php echo number_format($game["average_rating"])?></p>
                </li>
            <?php endforeach; ?>
        </ul>
    <?php endif; ?>
</body>
</html>
