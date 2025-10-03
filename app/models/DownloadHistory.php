<?php
require_once __DIR__ . '/BaseModel.php';

class DownloadHistory extends BaseModel
{
    protected string $table = "download_history";
    
    public function log(
        $user_id, 
        $game_id, 
        $ip
    ) : bool {
        $stmt = $this->db->prepare("INSERT INTO {$this->table} (user_id, game_id, ip_address) VALUES (?, ?, ?)");
        return $stmt->execute([$user_id, $game_id, $ip]);
    }

    public function getByGame (
        $game_id
    ) : array {
        $stmt = $this->db->prepare("SELECT * FROM {$this->table} WHERE game_id=?");
        $stmt->execute([$game_id]);
        return $stmt->fetchAll() ?: [];
    }

    public function getByUser (
        $user_id
    ) : array {
        $stmt = $this->db->prepare("SELECT * FROM {$this->table} WHERE user_id=?");
        $stmt->execute([$user_id]);
        return $stmt->fetchAll() ?: [];
    }

    public function getAll(): array
    {
        $stmt = $this->db->query("SELECT * FROM {$this->table}");
        return $stmt->fetchAll() ?: [];
    }
}
