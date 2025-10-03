<!-- views/user/login.php -->
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Login</title>
    <link rel="stylesheet" href="./assets/css/theme.css">
    <link rel="stylesheet" href="./assets/css/auth-style.css">
</head>
<body>
    <div class="preview">
        <img src="./uploads/avatars/admin.jpg" alt="">
    </div>
    <div class="login-box">
        <h1>Welcome back to <span class="highlight">Axum Arcade</span></h1>
        <p class="subtitle">Share your games and enjoy others'</p>

        <?php if (!empty($errorMessage)): ?>
            <p class="error"><?= htmlspecialchars($errorMessage) ?></p>
        <?php endif; ?>

        <form action="./login.php" method="POST">
            <div class="form-group">
                <label for="identifier">Email/Username</label>
                <input type="text" name="identifier" id="identifier">
            </div>
            <div class="form-group">
                <label for="password">Password</label>
                <input type="password" name="password" id="password">
            </div>

            <label for="remember" class="remember">
                <input type="checkbox" name="remember" id="remember"> Remember Me
            </label>
            <div class="form-links">
                <a href="./signup.php" class="sign-link">Sign Up</a>
                <a href="#" class="forgot-link">Forgot Password?</a>
            </div>

            <input type="submit" value="Login" class="btn-primary">
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
