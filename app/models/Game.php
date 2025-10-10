<?php
// Handles game data, including CRUD and search operations.
require_once __DIR__ . "/BaseModel.php";

class Game extends BaseModel
{
    protected string $table = "games";

    public function claimGame(int $gameId, int $userId): bool
    {
        $stmt = $this->db->prepare("SELECT * FROM {$this->table} WHERE id = ? AND user_id IS NULL AND status = 'approved'");
        $stmt->execute([$gameId]);
        $game = $stmt->fetch();

        if (!$game) {
            return false;
        }

        $update = $this->db->prepare("UPDATE {$this->table} SET user_id = ? WHERE id = ?");
        return $update->execute([$userId, $gameId]);
    }
    public function countApproved(): int
    {
        $stmt = $this->db->query("SELECT COUNT(*) as count FROM {$this->table} WHERE status = 'approved'");
        $result = $stmt->fetch();
        return $result ? (int)$result['count'] : 0;
    }

    public function incrementDownloadCount(int $gameId): bool
    {
        $sql = "UPDATE {$this->table} SET download_count = download_count + 1 WHERE id = ?";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([$gameId]);
    }

    public function updateRatingStats(int $gameId, float $averageRating, int $reviewCount): bool
    {
        $sql = "UPDATE games SET average_rating = :average_rating, review_count = :review_count WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([
            ':average_rating' => $averageRating,
            ':review_count' => $reviewCount,
            ':id' => $gameId
        ]);
    }
    public function create(
        int $userId,
        string $title,
        string $description,
        ?string $coverUrl = null,
        ?string $fileUrl = '',
        float $price = 0.00,
        ?string $version = '1.0',
        ?string $shortDescription = null
    ): int {
        $sql = "INSERT INTO {$this->table} (
            user_id, title, description, short_description, cover_url, file_url,
            price, version
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

        $stmt = $this->db->prepare($sql);

        $stmt->execute([
            $userId,
            $title,
            $description,
            $shortDescription,
            $coverUrl,
            $fileUrl,
            $price,
            $version,
        ]);

        return $this->db->lastInsertId();
    }

    public function findById(
        int $id
    ): ?array {
        $stmt = $this->db->prepare("SELECT * FROM {$this->table} WHERE id = :id");
        $stmt->execute(["id" => $id]);
        return $stmt->fetch() ?: null;
    }

    public function findAllAproved(): array
    {
        $stmt = $this->db->query("SELECT * FROM {$this->table} WHERE status = 'approved' ORDER BY download_count DESC");
        return $stmt->fetchAll() ?: [];
    }

    public function findAllApprovedNotOwnedOrPurchased(int $userId): array
    {
        $sql = "
        SELECT g.*
        FROM {$this->table} g
        WHERE g.status = 'approved'
        AND g.user_id != :user_id1
        AND g.id NOT IN (
            SELECT p.game_id
            FROM purchases p
            WHERE p.user_id = :user_id2
        )
        ORDER BY g.download_count DESC
    ";

        $stmt = $this->db->prepare($sql);
        $stmt->execute([
            'user_id1' => $userId,
            'user_id2' => $userId
        ]);

        return $stmt->fetchAll() ?: [];
    }

    public function findAllApprovedExceptUser(int $userId): array
    {
        $stmt = $this->db->prepare("SELECT * FROM {$this->table} WHERE status = 'approved' AND user_id != :user_id ORDER BY download_count DESC");
        $stmt->bindParam(':user_id', $userId, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->fetchAll() ?: [];
    }

    public function findByDeveloperId(
        $devId
    ): array {
        $stmt = $this->db->prepare("SELECT * FROM {$this->table} WHERE user_id = :devId");
        $stmt->execute(["devId" => $devId]);
        return $stmt->fetchAll() ?: [];
    }

    public function updateDetails(
        int $id,
        string $title,
        string $description,
        string $coverUrl,
        string $fileUrl,
        float $price = 0.00,
        string $version,
        ?string $shortDescription = null
    ): bool {
        $stmt = $this->db->prepare(
            "UPDATE {$this->table} SET
                title = :title,
                description = :description,
                short_description = :shortDescription,
                cover_url = :coverUrl,
                file_url = :fileUrl,
                price = :price,
                version = :version
            WHERE id = :id"
        );
        return $stmt->execute([
            "id" => $id,
            "title" => $title,
            "description" => $description,
            "shortDescription" => $shortDescription,
            "coverUrl" => $coverUrl,
            "fileUrl" => $fileUrl,
            "price" => $price,
            "version" => $version,
        ]);
    }

    public function updateStatus(int $gameId, string $status): bool
    {
        $allowed = ['draft', 'pending', 'approved', 'rejected'];
        if (!in_array($status, $allowed)) return false;

        $stmt = $this->db->prepare("UPDATE games SET status = :status, rejection_reason = NULL WHERE id = :id");
        return $stmt->execute(['status' => $status, 'id' => $gameId]);
    }

    public function reject(int $gameId, string $reason): bool
    {
        $stmt = $this->db->prepare("UPDATE games SET status = 'rejected', rejection_reason = :reason WHERE id = :id");
        return $stmt->execute(['reason' => $reason, 'id' => $gameId]);
    }

    public function incrementDownloads(
        int $id
    ): bool {
        $stmt = $this->db->prepare(
            "UPDATE {$this->table} SET download_count = download_count + 1 WHERE id = :id"
        );
        return $stmt->execute(["id" => $id]);
    }

    public function delete(
        int $id
    ): bool {
        $stmt = $this->db->prepare("DELETE FROM {$this->table} WHERE id = :id");
        return $stmt->execute(["id" => $id]);
    }

    public function topGames(
        int $limit = 5
    ): array {
        $stmt = $this->db->prepare("SELECT * FROM {$this->table} WHERE approved = 1 ORDER BY download_count DESC LIMIT :limit");
        return $stmt->execute(["limit" => $limit]) ? $stmt->fetchAll() : [];
    }

    public function searchByTitle(string $query): array
    {
        $stmt = $this->db->prepare("SELECT id, title, cover_url FROM games WHERE title LIKE :query");
        $stmt->execute(['query' => "%{$query}%"]);
        return $stmt->fetchAll() ?: [];
    }

    public function isWishlistable(int $gameId): bool
    {
        $stmt = $this->db->prepare("
            SELECT COUNT(*) AS count
            FROM {$this->table}
            WHERE id = :gameId
            AND (
                (description IS NOT NULL AND description != '')
                OR (cover_url IS NOT NULL AND cover_url != '')
                OR (file_url IS NOT NULL AND file_url != '')
            )
        ");
        $stmt->execute(["gameId" => $gameId]);
        $result = $stmt->fetch();

        return $result && (int)$result['count'] > 0;
    }

    public function findAll(): array
    {
        $sql = "SELECT g.*, u.username AS developer_username
                FROM {$this->table} g
                LEFT JOIN users u ON g.user_id = u.id
                ORDER BY g.id DESC";
        $stmt = $this->db->query($sql);
        return $stmt->fetchAll() ?: [];
    }

    public function countAll(): int
    {
        $stmt = $this->db->query("SELECT COUNT(*) as count FROM {$this->table}");
        $result = $stmt->fetch();
        return $result ? (int)$result['count'] : 0;
    }

    public function getAll(): array
    {
        $stmt = $this->db->query("SELECT * FROM {$this->table}");
        return $stmt->fetchAll() ?: [];
    }
}
