<?php
// app/models/Game.php
require_once __DIR__ . "/BaseModel.php";

class Game extends BaseModel
{
    protected string $table = "games";

    public function create(
        int $userId, 
        string $title, 
        string $description, 
        ?string $coverUrl = null,
        ?string $fileUrl = '', 
        float $price = 0.00, 
        ?string $version = '1.0',
        ?string $shortDescription = null,
    ): int {
        // Prepare the SQL query
        $sql = "INSERT INTO {$this->table} (
            user_id, title, description, short_description, cover_url, file_url, 
            price, version
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        
        // Prepare the statement
        $stmt = $this->db->prepare($sql);
        
        // Execute with parameters (NULL values will be passed for optional fields)
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
        ): ?array
    {
        $stmt = $this->db->prepare("SELECT * FROM {$this->table} WHERE id = :id");
        $stmt->execute(["id" => $id]);
        return $stmt->fetch() ?: null;
    }

    public function findAllAproved(): array
    {
        $stmt = $this->db->query("SELECT * FROM {$this->table} WHERE status = 'approved' ORDER BY download_count DESC");
        return $stmt->fetchAll() ?: [];
    }

    public function findByDeveloperId(
        $devId
        ): array
    {
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
        ?string $shortDescription = null,
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

    public function updateStatus(
        int $id, int $approved
    ): bool {
        $stmt = $this->db->prepare(
            "UPDATE {$this->table} SET approved = :approved WHERE id = :id"
        );
        return $stmt->execute([
            "id" => $id,
            "approved" => $approved,
        ]);
    }

    public function incrementDownloads(
        int $id
    ): bool{
        $stmt = $this->db->prepare(
            "UPDATE {$this->table} SET download_count = download_count + 1 WHERE id = :id"
        );
        return $stmt->execute(["id" => $id]);
    }

    public function delete (
        int $id
    ): bool {
        $stmt = $this->db->prepare("DELETE FROM {$this->table} WHERE id = :id");
        return $stmt->execute(["id" => $id]);
    }

    public function topGames(
        int $limit = 5
    ) : array {
        $stmt = $this->db->prepare("SELECT * FROM {$this->table} WHERE approved = 1 ORDER BY download_count DESC LIMIT :limit");
        return $stmt->execute(["limit" => $limit]) ? $stmt->fetchAll() : [];
    }

    public function searchByTitle(
        string $title
    ) : array {
        $stmt = $this->db->prepare("SELECT * FROM {$this->table} WHERE title LIKE :title AND approved = 1 ORDER BY download_count DESC");
        $stmt->execute(["title"=> "%$title%"]);
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
