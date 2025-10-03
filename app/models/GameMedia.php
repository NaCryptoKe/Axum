<?php
require_once __DIR__ . '/BaseModel.php';

class GameMedia extends BaseModel 
{
    protected string $table = "game_media";

    public function create(
        $game_id, 
        $url, 
        $type, 
        $caption = null, 
        $order = 0
    ) : bool {
        $stmt = $this->db->prepare("INSERT INTO {$this->table} (game_id, media_url, media_type, caption, display_order) VALUES (?, ?, ?, ?, ?)");
        return $stmt->execute([$game_id, $url, $type, $caption, $order]);
    }

    public function remove(
        $id
    ) : bool{
        $stmt = $this->db->prepare("DELETE FROM {$this->table} WHERE id=?");
        return $stmt->execute([$id]);
    }

    public function getAll(): array
    {
        $stmt = $this->db->query("SELECT * FROM {$this->table}");
        return $stmt->fetchAll() ?: [];
    }
}
