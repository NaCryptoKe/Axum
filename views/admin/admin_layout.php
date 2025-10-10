<?php
// views/admin/admin_layout.php

$basePath = $basePath ?? '/sxumarcade/public';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <title><?= htmlspecialchars($pageTitle ?? 'Admin Panel') ?> - AxumArcade</title>
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <link rel="stylesheet" href="<?= $basePath ?>/assets/css/theme.css">
    <link rel="stylesheet" href="<?= $basePath ?>/assets/css/admin-style.css"> 
    <link rel="icon" type="image/svg+xml" href="<?= $basePath ?>/assets/img/LOGO.svg">
</head>
<body>

    <header>
        <h1>AxumArcade Admin</h1>
        <div class="user-info">
            <a href="<?= $basePath ?>/" style="color:#fff; text-decoration:none;">Go to Frontend</a>
        </div>
    </header>
    
    <nav class="quick-links">
        <a href="<?= $basePath ?>/admin/dashboard">📊 Dashboard</a>
        <a href="<?= $basePath ?>/admin/games">🎮 Games</a>
        <a href="<?= $basePath ?>/admin/reviews">📝 Reviews</a>
        <a href="<?= $basePath ?>/admin/users">👥 Users</a>
    </nav>

    <div class="container">
        <?= $adminContent ?? '' ?>
    </div>

</body>
</html>