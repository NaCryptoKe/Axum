<?php
require_once __DIR__ . '/BaseModel.php';

class CommentLike extends BaseModel 
{
    protected string $table = "comment_likes";

    public function like(
        $comment_id, 
        $user_id
    ) : bool {
        $stmt = $this->db->prepare("INSERT IGNORE INTO {$this->table} (comment_id, user_id) VALUES (?, ?)");
        return $stmt->execute([$comment_id, $user_id]);
    }

    public function unlike(
        $comment_id, 
        $user_id
    ) : bool {
        $stmt = $this->db->prepare("DELETE FROM {$this->table} WHERE comment_id=? AND user_id=?");
        return $stmt->execute([$comment_id, $user_id]);
    }

    public function isLiked(
        $comment_id,
        $user_id
    ) : bool {
        $stmt = $this->db-prepare("SELECT * FROM {$this->table} WHERE comment_id=? AND user_id=?");
        return $stmt->execute([$comment_id, $user_id]);
    }

    public function countLikes(
        $comment_id
    ) : int {
        $stmt = $this->db->prepare("SELECT COUNT(*) as like_count FROM {$this->table} WHERE comment_id=?");
        return $stmt->execute([$comment_id])->fetchColumn() ?: 0;
    }
    
    public function getAll(): array
    {
        $stmt = $this->db->query("SELECT * FROM {$this->table}");
        return $stmt->fetchAll() ?: [];
    }
}
