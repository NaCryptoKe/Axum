<?php
require_once __DIR__ . '/BaseModel.php';

class CommunityPost extends BaseModel
{
    protected string $table = "community_posts";

    public function create(
        $user_id, 
        $title, 
        $content, 
        $type, 
        $game_id = null
    ) : bool {
        $stmt = $this->db->prepare("INSERT INTO {$this->table} (user_id, game_id, title, content, post_type) VALUES (?, ?, ?, ?, ?)");
        return $stmt->execute([$user_id, $game_id, $title, $content, $type]);
    }

    public function update(
        $id, 
        $title, 
        $content
    ) : bool {
        $stmt = $this->db->prepare("UPDATE {$this->table} SET title=?, content=? WHERE id=?");
        return $stmt->execute([$title, $content, $id]);
    }

    public function isPostUpdated(
        $id
    ) : bool {
        $stmt = $this->db->prepare("SELECT created_at, updated_at FROM {$this->table} WHERE id = ?");
        $stmt->execute([$id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$row) {
            return false; // No post found
        }

        return $row['created_at'] !== $row['updated_at'];
    }

    public function getById(
        $id
    ) : ?array {
        $stmt = $this->db->prepare("SELECT * FROM {$this->table} WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch() ?: null;
    }

    public function getByUserId(
        $user_id
    ) : array {
        $stmt = $this->db->prepare("SELECT * FROM {$this->table} WHERE user_id = ? ORDER BY created_at DESC");
        $stmt->execute([$user_id]);
        return $stmt->fetchAll() ?: [];
    }

    public function getActiveByUserId(
        $user_id
    ) : array {
        $stmt = $this->db->prepare("SELECT * FROM {$this->table} WHERE user_id = ? AND status = 'active' ORDER BY created_at DESC ");
        $stmt->execute([$user_id]);
        return $stmt->fetchAll() ?: [];
    }

    public function getByPostType(
        $user_id,
        $post_type
    ) : array {
        $stmt = $this->db->prepare("SELECT * FROM {$this->table} WHERE user_id = ? AND post_type = ? ORDER BY created_at DESC");
        $stmt->execute([$user_id, $post_type]);
        return $stmt->fetchAll() ?: [];
    }

    public function getByGameId(
        $game_id
    ) : array {
        $stmt = $this->db->prepare("SELECT * FROM {$this->table} WHERE game_id = ? ORDER BY created_at DESC");
        $stmt->execute([$game_id]);
        return $stmt->fetchAll() ?: [];
    }

    public function delete(
        $id
    ) : bool {
        $stmt = $this->db->prepare("DELETE FROM {$this->table} WHERE id = ?");
        return $stmt->execute([$id]);
    }

    public function commentCount(
        $post_id
    ) : int {
        $stmt = $this->db->prepare("SELECT COUNT(*) as count FROM post_comments WHERE post_id = ?");
        $stmt->execute([$post_id]);
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row ? (int)$row['count'] : 0;
    }

    public function getAll(): array
    {
        $stmt = $this->db->query("SELECT * FROM {$this->table}");
        return $stmt->fetchAll() ?: [];
    }
}
