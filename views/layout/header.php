<?php
// views/layout/header.php
$basePath = '/sxumarcade/public/';
require_once __DIR__ . '/../../app/helpers/auth.php';

$currentUserData = null;
if (currentUserId()) {
    require_once __DIR__ . '/../../app/models/User.php';
    $userModel = new User();
    $currentUserData = $userModel->findById(currentUserId());
}

$safeUsername = $currentUserData['username'] ?? 'Guest';
$profileUrl = $safeUsername !== 'Guest' ? "{$basePath}@{$safeUsername}" : "{$basePath}login.php";
$safeAvatar = $currentUserData['avatar_url'] ?? "{$basePath}assets/img/default-avatar.jpg";
?>

<header class="header">
    <button class="mobile-menu-toggle" id="mobileMenuBtn">☰</button>
    <div class="logo">
        <a href="<?= $basePath ?>games">
            <img src="<?= $basePath ?>assets/img/LOGO.svg" alt="Logo" class="logo-img">
        </a>
    </div>
    
    <div class="search">
    <form id="searchForm" action="<?= $basePath ?>search" method="GET">
        <input type="text" name="q" placeholder="Search games or users... 🔍" class="search-input" required>
    </form>
</div>

    
    <div class="profile">
        <a href="<?= $profileUrl ?>" class="profile-link">
            <img src="<?= htmlspecialchars($safeAvatar) ?>" alt="<?= htmlspecialchars($safeUsername) ?>'s Avatar" class="profile-avatar">
        </a>
    </div>
</header>


<script src="<?= $basePath ?>assets/js/layout.js"></script>