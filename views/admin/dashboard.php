<?php
// views/admin/dashboard.php
$pageTitle = $pageTitle ?? 'Admin Dashboard';

ob_start();
?>
<h2>📊 <?= htmlspecialchars($pageTitle) ?></h2>

<div class="stats-grid">
    <div class="card">
        <h3>👥 Total Users</h3>
        <p><?= number_format($stats['total_users'] ?? 0) ?></p>
        <p class="muted">All registered accounts</p>
    </div>

    <div class="card">
        <h3>🎮 Total Games</h3>
        <p><?= number_format($stats['total_games'] ?? 0) ?></p>
        <p class="muted">All uploaded games</p>
    </div>

    <div class="card">
        <h3>✅ Approved Games</h3>
        <p><?= number_format($stats['approved_games'] ?? 0) ?></p>
        <p class="muted">Currently live</p>
    </div>

    <div class="card">
        <h3>⏳ Pending Reviews</h3>
        <p><?= number_format($stats['pending_reviews'] ?? 0) ?></p>
        <p class="muted">Awaiting moderation</p>
    </div>
</div>

<p class="dashboard-footer">Last updated: <?= date('Y-m-d H:i:s') ?></p>

<?php
// Capture the output and store it in a variable
$adminContent = ob_get_clean();
require __DIR__ . "/admin_layout.php";