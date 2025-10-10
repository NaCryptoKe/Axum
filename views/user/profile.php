<?php
// views/user/profile.php

// These variables are assumed to be set by the Controller
$basePath = $basePath ?? '/sxumarcade/public';
$page     = $_GET['page'] ?? 'overview';

// Data variables assumed to be set by the controller:
// $userData, $isOwnProfile, $filepath (for avatar), $recentGames, etc.
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?= htmlspecialchars($userData['username'] ?? 'User') ?> - AxumArcade</title>

  <link rel="icon" type="image/svg+xml" href="<?= $basePath ?>/assets/img/LOGO.svg">
  <link rel="stylesheet" href="<?= $basePath ?>/assets/css/reset.css">
  <link rel="stylesheet" href="<?= $basePath ?>/assets/css/theme.css">
  <link rel="stylesheet" href="<?= $basePath ?>/assets/css/layout.css">
  <link rel="stylesheet" href="<?= $basePath ?>/assets/css/profile.css">
  <link rel="stylesheet" href="<?= $basePath ?>/assets/css/cards.css">
</head>

<body>
  <?php 
    $userController = new UserController();
    $userController->header($userData);
  ?>

  <main>
    <?php include __DIR__ . '/../layout/side-bar.php'; ?>

    <div class="content">
      <div class="profile-header">
        
        <?php if ($isOwnProfile): ?>
          <form id="avatar-form-header" action="<?= $basePath ?>/profile/update-avatar" method="POST" enctype="multipart/form-data">
            <label for="avatar-upload" class="custom-upload profile-avatar-large">
              <img class="profile-avatar" id="image-preview" src="<?= htmlspecialchars($filepath ?? $basePath . '/uploads/avatars/admin.jpg') ?>" alt="<?= htmlspecialchars($userData['username'] ?? 'User') ?>'s Avatar">
              <input type="file" id="avatar-upload" name="avatar" accept="image/*" style="display: none;">
              <div class="overlay">Change</div>
            </label>
          </form>
        <?php else: ?>
          <div class="profile-avatar-large">
            <img class="profile-avatar" src="<?= htmlspecialchars($filepath ?? $basePath . '/uploads/avatars/admin.jpg') ?>" alt="<?= htmlspecialchars($userData['username'] ?? 'User') ?>'s Avatar">
          </div>
        <?php endif; ?>
        
        <div class="profile-info">
          <h1><?= htmlspecialchars($userData['username'] ?? 'User') ?></h1>
          <p class="profile-email"><?= htmlspecialchars($userData['email'] ?? 'No email') ?></p>
          <p class="profile-join-date">Member since: <?= date('F Y', strtotime($userData['created_at'] ?? 'now')) ?></p>

          <?php if ($isOwnProfile): ?>
            <div class="profile-actions">
              <a href="<?= $basePath ?>/@<?= htmlspecialchars($userData['username']) ?>?page=settings" class="btn-edit">Edit Profile</a>
              <a href="<?= $basePath ?>/logout" class="btn-logout">Logout</a>
            </div>
          <?php endif; ?>
        </div>
      </div>

      <nav class="profile-nav">
        <a href="<?= $basePath ?>/@<?= htmlspecialchars($userData['username']) ?>" class="nav-item <?= $page === 'overview' ? 'active' : '' ?>">Overview</a>
      </nav>

      <div class="profile-content">
        <?php if ($page === 'overview'): ?>
          <h2>Welcome to <?= $isOwnProfile ? 'your' : htmlspecialchars($userData['username']) . "'s" ?> profile!</h2>
          
          <div class="welcome-summary">
            <p><strong>Username: </strong> <?= htmlspecialchars($userData['username'] ?? 'Guest') ?></p>
            <p><strong>Email: </strong> <?= htmlspecialchars($userData['email'] ?? 'Not available') ?></p>
            <p><strong>Member since: </strong> <?= date('F j, Y', strtotime($userData['created_at'] ?? 'now')) ?></p>
          </div>

          <div class="ed-played">
            <h2>Recently Downloaded Games</h2>
            <div class="games-row">
              <?php if (!empty($recentGames)): ?>
                <?php foreach ($recentGames as $game): ?>
                  <div class="game-card">
                    <img src="<?= htmlspecialchars($game['cover_url'] ?? $basePath . '/uploads/avatars/admin.jpg') ?>" 
                         alt="<?= htmlspecialchars($game['title'] ?? 'Game') ?>">
                    <p><?= htmlspecialchars($game['title']) ?></p>
                  </div>
                <?php endforeach; ?>
              <?php else: ?>
                <p>No recent games.</p>
              <?php endif; ?>
            </div>
          </div>

          <div class="game-stats">
            <div id="chartContainer" class="chart-container">
              <canvas id="hoursChart"></canvas>
            </div>

            <div class="top-games">
              <h2>Top 3 games this week</h2>
              <div class="game-list">
                <div class="game-stat">
                  <img src="<?= $basePath ?>/uploads/avatars/admin.jpg" alt="Top Game 1">
                  <p>Avatar The Last Airbender</p>
                  <span class="play-time">12 hours</span>
                </div>
                <div class="game-stat">
                  <img src="<?= $basePath ?>/uploads/avatars/admin.jpg" alt="Top Game 2">
                  <p>Minecraft Legends</p>
                  <span class="play-time">8 hours</span>
                </div>
                <div class="game-stat">
                  <img src="<?= $basePath ?>/uploads/avatars/admin.jpg" alt="Top Game 3">
                  <p>Cyberpunk 2077</p>
                  <span class="play-time">6 hours</span>
                </div>
              </div>
            </div>
          </div>

        <?php elseif ($page === 'settings' && $isOwnProfile): ?>
          <h2>Edit Profile</h2>

          <form action="<?= $basePath ?>/profile/update" method="POST" class="settings-form">
              <div class="form-group">
                  <label for="username">Username</label>
                  <input type="text" name="username" id="username" value="<?= htmlspecialchars($userData['username'] ?? '') ?>">
              </div>

              <div class="form-group">
                  <label for="bio">Bio</label>
                  <textarea name="bio" id="bio" placeholder="Tell us a little about yourself..."><?= htmlspecialchars($userData['bio'] ?? '') ?></textarea>
              </div>

              <button type="submit" class="btn-primary">Save Changes</button>
          </form>

          <h3>Change Password</h3>
          <form action="<?= $basePath ?>/profile/change-password" method="POST" class="settings-form">
              <div class="form-group">
                  <label for="current_password">Current Password</label>
                  <input type="password" name="current_password" id="current_password" required>
              </div>
              <div class="form-group">
                  <label for="new_password">New Password</label>
                  <input type="password" name="new_password" id="new_password" required>
              </div>
              <button type="submit" class="btn-primary">Change Password</button>
          </form>
        <?php endif; ?>
      </div>
    </div>
  </main>

  <!-- Load Chart.js first -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <!-- Then load profile.js -->
  <script src="<?= $basePath ?>/assets/js/profile.js"></script>
</body>
</html>
