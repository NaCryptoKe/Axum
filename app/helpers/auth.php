<?php
// Provides authentication and session management functions.
function loginUser($userId)
{
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    $_SESSION['user_id'] = $userId;
}

function logoutUser()
{
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    session_unset();
    session_destroy();
}

function currentUserId(): ?int
{
    if (session_status() === PHP_SESSION_NONE) {
        session_start();
    }
    return $_SESSION['user_id'] ?? null;
}

function requireLogin()
{
    if (!currentUserId()) {
        header("Location: /sxumarcade/public/login");
        exit;
    }
}

function requireAdmin(): void
{
    $userId = currentUserId();
    if (!$userId) {
        header("Location: /sxumarcade/public/login?error=Admin+access+required");
        exit;
    }

    require_once __DIR__ . '/../models/User.php';

    $userModel = new User();

    if (!$userModel->isAdmin($userId)) {
        header("Location: /sxumarcade/public/dashboard?error=Unauthorized+access");
        exit;
    }
}
