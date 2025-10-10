<?php
// views/layout/side-bar.php
$basePath = '/sxumarcade/public';

// === FIX: Ensure $currentUser data is always loaded for sidebar checks ===
require_once __DIR__ . '/../../app/helpers/auth.php';
$currentUserId = currentUserId(); 
$currentUser = [];

if ($currentUserId) {
    // Note: We need to load User.php relative to the side-bar file
    require_once __DIR__ . '/../../app/models/User.php';
    $userModel = new User();
    // Fetch user data, including 'is_admin'
    $currentUser = $userModel->findById($currentUserId) ?? [];
}
// If $userData was passed by the controller, it will override/supplement $currentUser here, 
// but the admin check below uses $currentUser.

// Helper function to check current page (must be defined or included)
if (!function_exists('isCurrentPage')) {
    function isCurrentPage($page) {
        // Simple URI segment check, robust enough for this use case
        $currentUri = $_SERVER['REQUEST_URI'] ?? '';
        return strpos($currentUri, $page) !== false;
    }
}
?>

<aside class="sidebar">
    <div class="menu-container">
        <a href="<?= $basePath ?>/dashboard" class="<?= isCurrentPage('@') ? 'active' : '' ?>">
            🏠 Dashboard
        </a>
        <a href="<?= $basePath ?>/games" class="<?= isCurrentPage('games') && !isCurrentPage('edit-games') ? 'active' : '' ?>">
            🎮 Browse Games
        </a>
        
        <h6>Your Library</h6>
        <a href="<?= $basePath ?>/library" class="<?= isCurrentPage('library') ? 'active' : '' ?>">
            📚 Library
        </a>

        <h6>Developer</h6>
        <a href="<?= $basePath ?>/game/create" class="<?= isCurrentPage('game/create') ? 'active' : '' ?>">
            📤 Upload Game
        </a>

        <h6>Help/Support</h6>
        <a href="<?= $basePath ?>/support" class="<?= isCurrentPage('support') ? 'active' : '' ?>">
            ⚙️ Support
        </a>

        <?php 
        // Admin Panel Visibility Check: is logged in AND is_admin is 1
        if (!empty($currentUser) && ($currentUser['is_admin'] === 1)): 
        ?>
        
        <h6>Admin</h6>
        <a href="<?= $basePath ?>/admin/dashboard" class="<?= strpos($_SERVER['REQUEST_URI'] ?? '', $basePath . '/admin') !== false ? 'active' : '' ?>" target="_blank">
            📊 Admin Panel
        </a>
        <?php endif; ?>
    </div>

    <div class="download-card">
        <p>🎉 Ready to play?</p>
        <p>Discover amazing games!</p>
        <a href="<?= $basePath ?>/games">
            <button>Explore Games</button>
        </a>
    </div>
</aside>