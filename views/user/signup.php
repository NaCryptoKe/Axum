<?php
$basePath = '/sxumarcade/public';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Sign Up</title>
    <link rel="stylesheet" href="<?= $basePath ?>/assets/css/theme.css">
    <link rel="stylesheet" href="<?= $basePath ?>/assets/css/auth-style.css">
    <link rel="icon" type="image/png" href="<?= $basePath ?>/assets/img/LOGO.svg">
</head>
<body>
    <div class="login-box">
        <h1>Join the <span class="highlight">Axum Arcade</span> Community</h1>
        <p class="subtitle">Create your account and start sharing your games today!</p>

        <?php if (!empty($errorMessage)): ?>
            <p class="error"><?= htmlspecialchars($errorMessage) ?></p>
        <?php endif; ?>

        <form action="<?= $basePath ?>/signup" method="POST">
            <div class="form-group">
                <label for="username">Username</label>
                <input type="text" name="username" id="username" required>
            </div>
            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" name="email" id="email" required>
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" name="password" id="password" required>
            </div>

            <div class="form-links">
                <a href="<?= $basePath ?>/login" class="sign-link">Sign In?</a>
                <a href="#" class="forgot-link">Forgot Password?</a>
            </div>

            <input type="submit" value="Sign Up" class="btn-primary">
        </form>

        <p class="divider">OR</p>

        <div class="social-login-container">
            <a href="#" class="social-login google"></a>
            <a href="#" class="social-login apple"></a>
            <a href="#" class="social-login github"></a>
        </div>
    </div>
</body>
</html>
