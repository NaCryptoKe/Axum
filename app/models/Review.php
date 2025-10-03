<?php
require_once __DIR__ . '/BaseModel.php';

class Review extends BaseModel
{
    protected string $table = "reviews";
    
    public function add(
        $user_id, 
        $game_id, 
        $rating, 
        $title, 
        $content,
        $is_verified_owner
    ) : bool{
        $stmt = $this->db->prepare("INSERT INTO {$this->table} (user_id, game_id, rating, title, content) VALUES (?, ?, ?, ?, ?)");
        return $stmt->execute([$user_id, $game_id, $rating, $title, $content]);
    }

    public function getForGame(
        $game_id
    ) : array{
        $stmt = $this->db->prepare("SELECT * FROM {$this->table} WHERE game_id=?");
        $stmt->execute([$game_id]);
        return $stmt->fetchAll();
    }

    public function changeStatus(
        $review_id,
        $status
    ) : bool{
        $stmt = $this->db->prepare("UPDATE {$this->table} SET status=? WHERE id=?");
        return $stmt->execute([$status, $review_id]);
    }

    public function helpfulCount(
        $id,
        $is_helpful
    ) : int{
        $stmt = $this->db->prepare("UPDATE {$this->table} SET helpful_count = helpful_count + IF(?=1, 1, -1) WHERE id=?");
        return $stmt->execute([$is_helpful, $id]);
    }

    public function getAll(): array
    {
        $stmt = $this->db->query("SELECT * FROM {$this->table}");
        return $stmt->fetchAll() ?: [];
    }
}
