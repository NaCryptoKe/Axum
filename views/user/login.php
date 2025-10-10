<?php
$basePath = '/sxumarcade/public';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Login</title>
    <link rel="stylesheet" href="<?= $basePath ?>/assets/css/theme.css"> 
    <link rel="stylesheet" href="<?= $basePath ?>/assets/css/auth-style.css">
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@600;800&family=Roboto:wght@400;500;700&display=swap" rel="stylesheet">
    <link rel="icon" type="image/png" href="<?= $basePath ?>/assets/img/LOGO.svg">
</head>
<body>
    <div class="login-box">
        <h1>Welcome back to <span class="highlight">Axum Arcade</span></h1>
        <p class="subtitle">Share your games and enjoy others'</p>

        <?php if (!empty($errorMessage)): ?>
            <p class="error"><?= htmlspecialchars($errorMessage) ?></p>
        <?php endif; ?>

        <form action="<?= $basePath ?>/login" method="POST">
            <div class="form-group">
                <label for="identifier">Email/Username</label>
                <input type="text" name="identifier" id="identifier" placeholder="Enter your email or username" required>
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" name="password" id="password" placeholder="Enter your password" required>
            </div>

            <div class="form-links">
                <label for="remember" class="remember">
                    <input type="checkbox" name="remember" id="remember"> Remember Me
                </label>
                
                <a href="#" class="forgot-link">Forgot Password?</a>
            </div>

            <input type="submit" value="Login" class="btn-primary">
        </form>

        <p class="divider">OR</p>

        <div class="social-login-container">
            <a href="#" class="social-login google" title="Login with Google"></a>
            <a href="#" class="social-login apple" title="Login with Apple"></a>
            <a href="#" class="social-login github" title="Login with GitHub"></a>
        </div>
        
        <p class="signup-prompt">
             Don't have an account? <a href="<?= $basePath ?>/signup" class="sign-link">Sign Up</a>
        </p>

    </div>
</body>
</html>