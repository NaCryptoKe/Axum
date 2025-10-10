<?php
// Manages user reviews for games.
require_once __DIR__ . "/BaseModel.php";
require_once __DIR__ . "/Game.php";

class Review extends BaseModel
{
    protected string $table = "reviews";

    public function create(int $userId, int $gameId, int $rating, string $title, string $content, bool $isVerifiedOwner = false): int|false
    {
        $sql = "INSERT INTO {$this->table}
            (user_id, game_id, rating, title, content, is_verified_owner, status)
            VALUES (:user_id, :game_id, :rating, :title, :content, :is_verified_owner, 'pending')";

        try {
            $stmt = $this->db->prepare($sql);
            $stmt->execute([
                ':user_id' => $userId,
                ':game_id' => $gameId,
                ':rating' => $rating,
                ':title' => $title,
                ':content' => $content,
                ':is_verified_owner' => $isVerifiedOwner
            ]);
            $reviewId = (int)$this->db->lastInsertId();

            return $reviewId;
        } catch (\PDOException $e) {
            if ($e->getCode() == '23000') {
            }
            return false;
        }
    }

    private function updateGameStats(int $gameId): void
    {
        $stats = $this->getGameRatingStats($gameId);

        $gameModel = new Game();
        $gameModel->updateRatingStats($gameId, $stats['average_rating'], $stats['review_count']);
    }

    public function getGameRatingStats(int $gameId): array
    {
        $sql = "SELECT AVG(rating) AS avg_rating, COUNT(id) AS review_count
                FROM {$this->table}
                WHERE game_id = :game_id AND status = 'approved'";

        $stmt = $this->db->prepare($sql);
        $stmt->execute([':game_id' => $gameId]);
        $result = $stmt->fetch();

        return [
            'average_rating' => (float)($result['avg_rating'] ?? 0.0),
            'review_count' => (int)($result['review_count'] ?? 0)
        ];
    }

    public function approveReview(int $reviewId): bool
    {
        $sql = "UPDATE {$this->table} SET status = 'approved' WHERE id = :id AND status != 'approved'";
        $stmt = $this->db->prepare($sql);
        $success = $stmt->execute([':id' => $reviewId]);

        if ($success && $stmt->rowCount() > 0) {
            $stmt = $this->db->prepare("SELECT game_id FROM {$this->table} WHERE id = :id");
            $stmt->execute([':id' => $reviewId]);
            $review = $stmt->fetch();

            if ($review) {
                $this->updateGameStats($review['game_id']);
            }
            return true;
        }
        return false;
    }

    public function delete(int $id): bool
    {
        $stmt = $this->db->prepare("SELECT game_id, status FROM {$this->table} WHERE id = :id");
        $stmt->execute([':id' => $id]);
        $review = $stmt->fetch();

        $sql = "DELETE FROM {$this->table} WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        $success = $stmt->execute([':id' => $id]);

        if ($success && $review && $review['status'] === 'approved') {
            $this->updateGameStats($review['game_id']);
        }

        return $success;
    }

    public function countPending(): int
    {
        $sql = "SELECT COUNT(*) FROM {$this->table} WHERE status = 'pending'";
        $stmt = $this->db->query($sql);
        return (int)$stmt->fetchColumn();
    }

    public function findAllByStatus(string $status): array
    {
        $sql = "SELECT r.*, u.username, g.title AS game_title
                FROM {$this->table} r
                JOIN users u ON r.user_id = u.id
                JOIN games g ON r.game_id = g.id
                WHERE r.status = :status";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([':status' => $status]);
        return $stmt->fetchAll() ?: [];
    }
    public function findByStatus(string $status = 'pending'): array
    {
        $sql = "SELECT r.*, u.username, g.title AS game_title
                FROM {$this->table} r
                JOIN users u ON r.user_id = u.id
                JOIN games g ON r.game_id = g.id
                WHERE r.status = :status
                ORDER BY r.created_at DESC";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([':status' => $status]);
        return $stmt->fetchAll() ?: [];
    }

    public function getReviewsWithDetailsByStatus(string $status): array
    {
        $sql = "
            SELECT
                r.*,
                g.title AS game_title,
                u.username AS username
            FROM {$this->table} r
            JOIN games g ON r.game_id = g.id
            JOIN users u ON r.user_id = u.id
            WHERE r.status = :status
            ORDER BY r.created_at DESC
        ";

        $stmt = $this->db->prepare($sql);
        $stmt->execute([':status' => $status]);
        return $stmt->fetchAll() ?: [];
    }

    public function countByStatus(string $status): int
    {
        $sql = "SELECT COUNT(*) as count FROM {$this->table} WHERE status = :status";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([':status' => $status]);
        return (int)($stmt->fetch()['count'] ?? 0);
    }

    public function rejectReview(int $reviewId): bool
    {
        $sql = "UPDATE {$this->table} SET status = 'rejected' WHERE id = :id AND status != 'rejected'";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([':id' => $reviewId]);
    }

    public function deleteReview(int $reviewId): bool
    {
        $stmt = $this->db->prepare("SELECT game_id FROM {$this->table} WHERE id = :id");
        $stmt->execute([':id' => $reviewId]);
        $review = $stmt->fetch();

        if (!$review) {
            return false;
        }

        $deleteSql = "DELETE FROM {$this->table} WHERE id = :id";
        $deleteStmt = $this->db->prepare($deleteSql);
        $success = $deleteStmt->execute([':id' => $reviewId]);

        if ($success) {
            $this->updateGameStats($review['game_id']);
        }

        return $success;
    }
    public function updateStatus(int $reviewId, string $status): bool
    {
        $allowedStatuses = ['pending', 'approved', 'rejected'];

        if (!in_array($status, $allowedStatuses, true)) {
            return false;
        }

        $sql = "UPDATE reviews SET status = :status WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([
            ':status' => $status,
            ':id' => $reviewId
        ]);
    }

    public function findApprovedByGameId(int $gameId): array
    {
        $sql = "
        SELECT r.*, u.username AS reviewer_username
        FROM {$this->table} r
        JOIN users u ON r.user_id = u.id
        WHERE r.game_id = :game_id
          AND r.status = 'approved'
        ORDER BY r.created_at DESC
    ";

        $stmt = $this->db->prepare($sql);
        $stmt->execute([':game_id' => $gameId]);
        return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
    }
    public function hasUserReviewedGame(int $userId, int $gameId): bool
    {
        $sql = "SELECT COUNT(*) FROM {$this->table} WHERE user_id = :user_id AND game_id = :game_id";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            ':user_id' => $userId,
            ':game_id' => $gameId
        ]);

        return (int)$stmt->fetchColumn() > 0;
    }
}
