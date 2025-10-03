<?php
require_once __DIR__ . '/BaseModel.php';

class GameCategory extends BaseModel
{
    protected string $table = "game_categories";

    public function assign(
        $game_id,
        $cat_id
    ) : bool {
        $stmt = $this->db->prepare("INSERT IGNORE INTO {$this->table} (game_id, category_id) VALUES (?, ?)");
        return $stmt->execute([$game_id, $cat_id]);
    }

    public function remove(
        $game_id, 
        $cat_id
    ) : bool {
        $stmt = $this->db->prepare("DELETE FROM {$this->table} WHERE game_id=? AND category_id=?");
        return $stmt->execute([$game_id, $cat_id]);
    }

    public function getAll(): array
    {
        $stmt = $this->db->query("SELECT * FROM {$this->table}");
        return $stmt->fetchAll() ?: [];
    }
}
