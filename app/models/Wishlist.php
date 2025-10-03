<?php
require_once __DIR__ . '/BaseModel.php';

class Wishlist extends BaseModel
{
    protected string $table = "wishlists";
    
    public function add($user_id, $game_id) {
        $stmt = $this->db->prepare("INSERT IGNORE INTO {$this->table} (user_id, game_id) VALUES (?, ?)");
        return $stmt->execute([$user_id, $game_id]);
    }

    public function remove($user_id, $game_id) {
        $stmt = $this->db->prepare("DELETE FROM {$this->table} WHERE user_id=? AND game_id=?");
        return $stmt->execute([$user_id, $game_id]);
    }

    public function getByUserId($user_id): array
    {
        $stmt = $this->db->prepare("SELECT * FROM {$this->table} WHERE user_id=?");
        $stmt->execute([$user_id]);
        return $stmt->fetchAll() ?: [];
    }

    public function wishlistCount(
        $game_id
    ): int
    {
        $stmt = $this->db->prepare("SELECT COUNT(*) as count FROM {$this->table} WHERE game_id=?");
        $stmt->execute([$game_id]);
        $result = $stmt->fetch();
        return $result ? (int)$result['count'] : 0;
    }

    public function getAll(): array
    {
        $stmt = $this->db->query("SELECT * FROM {$this->table}");
        return $stmt->fetchAll() ?: [];
    }
}
