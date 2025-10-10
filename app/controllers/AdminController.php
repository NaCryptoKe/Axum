<?php
// Controller for handling administrative tasks and dashboard functionality.
require_once __DIR__ . '/../models/Review.php';
require_once __DIR__ . '/../models/ModerationAction.php';
require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../models/Game.php';
require_once __DIR__ . '/../helpers/auth.php';

class AdminController
{
    private string $basePath = '/sxumarcade/public';

    public function __construct()
    {
        requireLogin();
        requireAdmin();
    }

    public function dashboard(): void
    {
        $pageTitle = 'Admin Dashboard';
        $userModel = new User();
        $gameModel = new Game();
        $reviewModel = new Review();

        $stats = [
            'total_users' => $userModel->countAll(),
            'total_games' => $gameModel->countAll(),
            'approved_games' => $gameModel->countApproved(),
            'pending_reviews' => $reviewModel->countByStatus('pending'),
        ];

        require __DIR__ . "/../../views/admin/dashboard.php";
    }

    public function listUsers(): void
    {
        $userModel = new User();
        $moderationModel = new ModerationAction();
        $pageTitle = "Manage Users";

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $action = $_POST['action'] ?? null;
            $targetId = isset($_POST['user_id']) ? (int)$_POST['user_id'] : null;
            $adminId = currentUserId();

            if ($action && $targetId) {
                if ($action === 'promote') {
                    $userModel->promoteToAdmin($targetId);
                    $moderationModel->log($adminId, 'user', $targetId, 'promoted');
                } elseif ($action === 'demote') {
                    $userModel->demoteFromAdmin($targetId);
                    $moderationModel->log($adminId, 'user', $targetId, 'demoted');
                } elseif ($action === 'delete') {
                    $userModel->delete($targetId);
                    $moderationModel->log($adminId, 'user', $targetId, 'deleted');
                }
            }
            header("Location: {$this->basePath}/admin/users");
            exit;
        }

        $users = $userModel->findAll();
        require __DIR__ . "/../../views/admin/list_users.php";
    }

    public function listGames(): void
    {
        $gameModel = new Game();
        $moderationModel = new ModerationAction();
        $pageTitle = "Manage Games";

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $action = $_POST['action'] ?? null;
            $gameId = isset($_POST['game_id']) ? (int)$_POST['game_id'] : null;
            $adminId = currentUserId();

            if ($action && $gameId) {
                if ($action === 'approve') {
                    $success = $gameModel->updateStatus($gameId, 'approved');
                    if ($success) $moderationModel->log($adminId, 'game', $gameId, 'approved');
                } elseif ($action === 'reject') {
                    $reason = $_POST['rejection_reason'] ?? '';
                    $success = $gameModel->reject($gameId, $reason);
                    if ($success) $moderationModel->log($adminId, 'game', $gameId, 'rejected', $reason);
                } elseif ($action === 'delete') {
                    $success = $gameModel->delete($gameId);
                    if ($success) $moderationModel->log($adminId, 'game', $gameId, 'deleted');
                }
            }

            header("Location: {$this->basePath}/admin/games");
            exit;
        }

        $games = $gameModel->findAll();
        require __DIR__ . "/../../views/admin/list_games.php";
    }

    public function listReviews(): void
    {
        $statusFilter = $_GET['status'] ?? 'pending';
        $reviewModel = new Review();
        $pendingReviewsCount = $reviewModel->countByStatus('pending');
        $reviews = $reviewModel->getReviewsWithDetailsByStatus($statusFilter);

        $pageTitle = "Review Moderation";
        require __DIR__ . "/../../views/admin/list_reviews.php";
    }

    public function approveReview(int $id = null): void
    {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $reviewId = $_POST['review_id'] ?? $id;
            if ($reviewId) {
                $reviewModel = new Review();
                if ($reviewModel->updateStatus((int)$reviewId, 'approved')) {
                    header("Location: {$this->basePath}/admin/reviews?message=Review+approved");
                    exit;
                }
            }
        }
        header("Location: {$this->basePath}/admin/reviews?error=Invalid+request");
        exit;
    }

    public function rejectReview(int $id = null): void
    {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $reviewId = $_POST['review_id'] ?? $id;
            if ($reviewId) {
                $reviewModel = new Review();
                if ($reviewModel->updateStatus((int)$reviewId, 'rejected')) {
                    header("Location: {$this->basePath}/admin/reviews?message=Review+rejected");
                    exit;
                }
            }
        }
        header("Location: {$this->basePath}/admin/reviews?error=Invalid+request");
        exit;
    }

    public function deleteReview(int $id = null): void
    {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $reviewId = $_POST['review_id'] ?? $id;
            if ($reviewId) {
                $reviewModel = new Review();
                $reviewModel->delete((int)$reviewId);
                header("Location: {$this->basePath}/admin/reviews?message=Review+deleted");
                exit;
            }
        }
        header("Location: {$this->basePath}/admin/reviews?error=Invalid+request");
        exit;
    }
}
