<?php
//auth.php
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

function requireLogin() {
    if (!currentUserId()) {
        header("Location: login.php");
        exit;
    }
}
