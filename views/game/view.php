<?php
// views/game/show.php

$basePath = '/sxumarcade/public';
$game = $gameData ?? null;

// Error/Message/Feedback retrieval...
$error = $_GET['error'] ?? null;
$message = $_GET['message'] ?? null;
$feedback = $_GET['feedback'] ?? null;

// Authentication and Ownership check...
require_once __DIR__ . '/../../app/helpers/auth.php';
$currentUserId = currentUserId();
$isDeveloper = $currentUserId && ($currentUserId === ($game['user_id'] ?? null));

require_once __DIR__ . '/../../app/models/Purchase.php';
$purchaseModel = new Purchase();
$userOwnsGame = $currentUserId 
    ? $purchaseModel->hasPurchased($currentUserId, $game['id'])
    : false;

// Star Display Function
function displayStars(float $rating): string {
    $html = '';
    $rating = round($rating, 1);
    for ($i = 1; $i <= 5; $i++) {
        if ($rating >= $i) {
            $html .= '★';
        } elseif ($rating > $i - 1 && $rating < $i) {
            $html .= '½';
        } else {
            $html .= '☆';
        }
    }
    return "<span class='rating-stars'>" . $html . "</span>";
}

// Check if the user has already reviewed the game
$hasReviewed = $currentUserId && isset($reviewModel) && $reviewModel->hasUserReviewedGame($currentUserId, $game['id']);

// Count reviews for badge
$reviewCount = count($reviews ?? []);
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?= htmlspecialchars($game['title'] ?? 'Game Not Found') ?> - AxumArcade</title>

    <link rel="icon" type="image/svg+xml" href="<?= $basePath ?>/assets/img/LOGO.svg">
    <link rel="stylesheet" href="<?= $basePath ?>/assets/css/reset.css">
    <link rel="stylesheet" href="<?= $basePath ?>/assets/css/theme.css">
    <link rel="stylesheet" href="<?= $basePath ?>/assets/css/layout.css">
    <link rel="stylesheet" href="<?= $basePath ?>/assets/css/cards.css">
    <link rel="stylesheet" href="<?= $basePath ?>/assets/css/game-view.css">
</head>

<body>
    <?php 
        // Include header if UserController is available
        if (class_exists('UserController')) {
            $userController = new UserController();
            $userController->header();
        }
    ?>
    <main>
        <?php include __DIR__ . '/../layout/side-bar.php'; ?>

        <div class="content">
            <div class="game-page">
                
                <?php if (!empty($error)): ?>
                    <div class="alert alert-error">Error: <?= htmlspecialchars(urldecode($error)) ?></div>
                <?php endif; ?>
                <?php if (!empty($message)): ?>
                    <div class="alert alert-success"><?= htmlspecialchars(urldecode($message)) ?></div>
                <?php endif; ?>

                <header class="game-header-main">
                    <div class="game-media__cover">
                        <img src="<?= htmlspecialchars($game['cover_url'] ?? $basePath . '/uploads/avatars/admin.jpg') ?>" 
                             alt="<?= htmlspecialchars($game['title']) ?>">
                    </div>

                    <div class="game-info">
                        <h1 class="game-info__title"><?= htmlspecialchars($game['title']) ?> 
                            <small>(v<?= htmlspecialchars($game['version'] ?? '1.0') ?>)</small>
                        </h1>
                        <p class="game-info__short-desc">
                            <?= htmlspecialchars($game['short_description'] ?? 'No short description available.') ?>
                        </p>
                        
                        <div class="game-info__meta">
                            <div class="meta-item">
                                <span class="meta-label">Developer:</span>
                                <span class="meta-value"><?= htmlspecialchars($game['developer_username'] ?? 'Anonymous') ?></span>
                            </div>
                            <div class="meta-item">
                                <span class="meta-label">Rating:</span>
                                <span class="meta-value rating-display">
                                    <?= displayStars($game['average_rating'] ?? 0) ?> 
                                    (<?= number_format($game['average_rating'] ?? 0, 1) ?>)
                                </span>
                            </div>
                            <div class="meta-item">
                                <span class="meta-label">Price:</span>
                                <strong class="meta-value price-tag">
                                    <?= $game['price'] > 0 ? 'ETB' . number_format($game['price'], 2) : 'Free' ?>
                                </strong>
                            </div>
                        </div>
                    </div>

                    <aside class="game-action-panel">
                        <p class="price-action-tag">
                            <?= $game['price'] > 0 
                                ? 'Purchase Price: <strong>ETB' . number_format($game['price'], 2) . '</strong>' 
                                : 'Get it for <strong>Free</strong>' ?>
                        </p>
                        
                        <div class="action-buttons-group">
                            <?php if ($isDeveloper): ?>
                                <a href="<?= $basePath ?>/game/edit/<?= $game['id'] ?>" class="btn-primary btn-cta edit-btn">Edit Game</a>
                            <?php elseif ($userOwnsGame): ?>
                                <a href="<?= $basePath ?>/game/download/<?= $game['id'] ?>" class="btn-primary btn-cta download-btn">Download Game</a>
                            <?php elseif ($game['price'] == 0): ?>
                                <form method="POST" action="<?= $basePath ?>/process_payment">
                                    <input type="hidden" name="game_id" value="<?= $game['id'] ?>">
                                    <input type="hidden" name="amount" value="0.00">
                                    <input type="hidden" name="transaction_no" value="FREE_CLAIM">
                                    <button type="submit" class="btn-primary btn-cta claim-btn">Claim Free Game</button>
                                </form>
                            <?php else: ?>
                                <form method="POST" action="<?= $basePath ?>/process_payment">
                                    <input type="hidden" name="game_id" value="<?= $game['id'] ?>">
                                    <input type="hidden" name="amount" value="<?= $game['price'] ?>">
                                    <input type="text" name="transaction_no" placeholder="Enter Transaction ID" required class="form-control">
                                    <button type="submit" class="btn-primary btn-cta buy-btn">Buy Now</button>
                                </form>
                            <?php endif; ?>
                        </div>
                    </aside>
                </header>

                <div class="game-content-main">
                    <section class="game-description-section">
                        <h2>About the Game</h2>
                        <div class="description-content-area">
                            <?= nl2br(htmlspecialchars($game['description'])) ?>
                        </div>
                    </section>

                    <section class="reviews-section">
                        <h2>User Reviews <span class="review-count-badge"><?= $reviewCount ?></span></h2>

                        <?php if ($currentUserId && !$hasReviewed && $userOwnsGame): ?>
                            <div class="review-form-area">
                                <h3>Share Your Thoughts</h3>
                                <form action="<?= $basePath ?>/game/review/<?= $game['id'] ?>" method="POST" class="review-form">
                                    <div class="form-group">
                                        <label for="rating">Rating (1-5)</label>
                                        <select id="rating" name="rating" required class="form-control">
                                            <option value="5">5 - Excellent</option>
                                            <option value="4">4 - Very Good</option>
                                            <option value="3">3 - Good</option>
                                            <option value="2">2 - Fair</option>
                                            <option value="1">1 - Poor</option>
                                        </select>
                                    </div>
                                    <div class="form-group">
                                        <label for="title">Review Title</label>
                                        <input type="text" id="title" name="title" required maxlength="100" class="form-control">
                                    </div>
                                    <div class="form-group">
                                        <label for="content">Review Content</label>
                                        <textarea id="content" name="content" rows="4" required class="form-control"></textarea>
                                    </div>
                                    <button type="submit" class="btn-primary btn-submit-review">Submit Review</button>
                                </form>
                            </div>
                        <?php elseif ($hasReviewed): ?>
                            <p class="muted-info">You’ve already reviewed this game. Thanks for the feedback!</p>
                        <?php elseif ($currentUserId && !$userOwnsGame): ?>
                            <p class="muted-info">You must own this game to leave a review.</p>
                        <?php else: ?>
                            <p class="muted-info">Please <a href="<?= $basePath ?>/login">log in</a> to leave a review.</p>
                        <?php endif; ?>

                        <div class="reviews-list">
                            <?php if (empty($reviews)): ?>
                                <p class="muted-info">Be the first to leave a review! 📝</p>
                            <?php else: ?>
                                <?php foreach ($reviews as $review): ?>
                                    <article class="review-card">
                                        <div class="review-header">
                                            <h4><?= htmlspecialchars($review['title'] ?? $review['username']) ?></h4>
                                            <span class="rating-stars"><?= displayStars($review['rating']) ?></span>
                                        </div>
                                        <div class="review-meta">
                                            Posted on: <?= htmlspecialchars($review['created_at']) ?> 
                                            by <strong><?= htmlspecialchars($review['reviewer_username'] ?? $review['username']) ?></strong>
                                            <?php if ($review['is_verified_owner'] ?? false): ?>
                                                <span class="badge verified-owner-badge">Verified Owner</span>
                                            <?php endif; ?>
                                        </div>
                                        <p class="review-content"><?= nl2br(htmlspecialchars($review['content'])) ?></p>
                                    </article>
                                <?php endforeach; ?>
                            <?php endif; ?>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    </main>

    <?php if (!empty($feedback)): ?>
        <div id="feedback-modal" class="modal" data-feedback="<?= htmlspecialchars($feedback) ?>">
            <div class="modal-content">
                <span id="close-modal">&times;</span>
                <p id="modal-message"></p>
            </div>
        </div>
    <?php endif; ?>

    <?php if (!empty($message)): ?>
        <div id="update-feedback-modal" class="modal">
            <div class="modal-content">
                <span id="close-update-modal">&times;</span>
                <p><?= htmlspecialchars(urldecode($message)) ?></p>
            </div>
        </div>
    <?php endif; ?>

    <script>
    document.addEventListener('DOMContentLoaded', () => {
        const modal = document.getElementById('update-feedback-modal');
        const closeModal = document.getElementById('close-update-modal');
        if (modal) {
            modal.style.display = "block";
            closeModal.onclick = () => modal.style.display = "none";
            window.onclick = (e) => { if (e.target == modal) modal.style.display = "none"; };
        }
    });
    </script>
</body>
</html>
