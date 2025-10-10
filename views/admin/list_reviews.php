<?php
// app/views/admin/list_reviews.php
$pageTitle = 'Review Moderation';
$basePath = '/sxumarcade/public';
// Variables expected: $reviews (array of reviews), $statusFilter (e.g., 'pending'), $pendingReviewsCount (int)

// Set default filter if not provided
$statusFilter = $statusFilter ?? 'pending';

// Start output buffering to capture the content
ob_start();
?>

    <div class="admin-reviews-container">
        <h1>📝 Review Moderation</h1>
        <p class="subtitle">Review user-submitted content before it goes live.</p>

        <?php if (!empty($_GET['message'])): ?>
            <div class="success-message"> 
                <?= htmlspecialchars(urldecode($_GET['message'])) ?>
            </div>
        <?php endif; ?>

        <div class="tabs">
            <a href="<?= $basePath ?>/admin/reviews?status=pending" class="tab-btn <?= $statusFilter === 'pending' ? 'active' : '' ?>">
                Pending (<?= $pendingReviewsCount ?? 0 ?>)
            </a>
            <a href="<?= $basePath ?>/admin/reviews?status=approved" class="tab-btn <?= $statusFilter === 'approved' ? 'active' : '' ?>">
                Approved
            </a>
            <a href="<?= $basePath ?>/admin/reviews?status=rejected" class="tab-btn <?= $statusFilter === 'rejected' ? 'active' : '' ?>">
                Rejected
            </a>
        </div>

        <?php if (empty($reviews)): ?>
            <p class="muted" style="text-align: center; padding: 20px;">No reviews in the '<?= $statusFilter ?>' queue.</p>
        <?php else: ?>
            <div class="reviews-list">
                <?php foreach ($reviews as $review): ?>
                    <div class="review-item">
                        <div class="review-header">
                            <span>Rating: <?= htmlspecialchars($review['rating']) ?>/5 by 
                                <strong><?= htmlspecialchars($review['username'] ?? 'Anonymous') ?></strong>
                            </span>
                            <span class="review-status status-<?= htmlspecialchars($review['status']) ?>">
                                <?= ucfirst(htmlspecialchars($review['status'])) ?>
                            </span>
                        </div>
                        
                        <div class="review-meta">
                            Game: <a href="<?= $basePath ?>/game/<?= $review['game_id'] ?>" target="_blank">
                                <?= htmlspecialchars($review['game_title']) ?>
                            </a> | 
                            Submitted: <?= htmlspecialchars($review['created_at']) ?>
                        </div>

                        <div class="review-content">
                            <?= nl2br(htmlspecialchars($review['content'])) ?>
                        </div>
                        
                        <?php if ($review['status'] === 'pending'): ?>
                            <div class="review-actions" style="margin-top: 15px;">
                                <form action="<?= $basePath ?>/admin/approve-review/<?= $review['id'] ?>" method="POST">
                                    <button type="submit" class="btn btn-small btn-approve">Approve</button>
                                </form>
                                
                                <form action="<?= $basePath ?>/admin/reject-review/<?= $review['id'] ?>" method="POST">
                                    <button type="submit" class="btn btn-small btn-reject">Reject</button>
                                </form>
                            </div>
                        <?php endif; ?>
                        
                       <?php if ($review['status'] !== 'pending'): ?>
    <div class="review-actions">
        <?php if ($review['status'] === 'approved'): ?>
            <form action="<?= $basePath ?>/admin/reject-review/<?= $review['id'] ?>\" method="POST">
                <button type="submit" class="btn btn-small btn-reject">Reject</button>
            </form>
        <?php elseif ($review['status'] === 'rejected'): ?>
            <form action="<?= $basePath ?>/admin/approve-review/<?= $review['id'] ?>\" method="POST">
                <button type="submit" class="btn btn-small btn-approve">Approve</button>
            </form>
        <?php endif; ?>

        <form action="<?= $basePath ?>/admin/delete-review/<?= $review['id'] ?>\" method="POST" onsubmit="return confirm('Are you sure you want to permanently delete this review?');">
            <button type="submit" class="btn btn-small btn-delete">Delete Permanently</button>
        </form>
    </div>
<?php endif; ?>

                    </div>
                <?php endforeach; ?>
            </div>
        <?php endif; ?>
    </div>

<?php
// Capture the output and store it in a variable
$adminContent = ob_get_clean();
require __DIR__ . "/admin_layout.php";