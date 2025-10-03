<?php
require_once __DIR__ . '/BaseModel.php';

class PostComment extends BaseModel
{
    protected string $table = "post_comments";
    
    public function create(
        $post_id, 
        $user_id, 
        $content, 
        $parent_id = null
    ) : bool{
        $stmt = $this->db->prepare("INSERT INTO {$this->table} (post_id, user_id, parent_comment_id, content) VALUES (?, ?, ?, ?)");
        return $stmt->execute([$post_id, $user_id, $parent_id, $content]);
    }

    public function getForPostHidden(
        $post_id
    ) : array{
        $stmt = $this->db->prepare("SELECT * FROM {$this->table} WHERE post_id=? AND status = 'hidden' ORDER BY created_at ASC");
        $stmt->execute([$post_id]);
        return $stmt->fetchAll() ?: [];
    }

    public function getForPostActive(
        $post_id
    ) : array{
        $stmt = $this->db->prepare("SELECT * FROM {$this->table} WHERE post_id=? AND parent_comment_id = 'NULL' AND status = 'active' ORDER BY created_at ASC");
        $stmt->execute([$post_id]);
        return $stmt->fetchAll() ?: [];
    }

    public function getReplies(
        $parent_id
    ) : array {
        $stmt = $this->db->prepare("SELECT * FROM {$this->table} WHERE parent_comment_id=? AND status = 'active' ORDER BY created_at ASC");
        $stmt->execute([$parent_id]);
        return $stmt->fetchAll() ?: [];
    }

    public function changeStatus(
        $comment_id, 
        $new_status
    ) : bool {
        $stmt = $this->db->prepare("UPDATE {$this->table} SET status=? WHERE id=?");
        return $stmt->execute([$new_status, $comment_id]);
    }

    public function delete(
        $comment_id
    ) : bool {
        $stmt = $this->db->prepare("DELETE FROM {$this->table} WHERE id=?");
        return $stmt->execute([$comment_id]);
    }

    public function edit(
        $comment_id, 
        $new_content
    ) : bool {
        $stmt = $this->db->prepare("UPDATE {$this->table} SET content=? WHERE id=?");
        return $stmt->execute([$new_content, $comment_id]);
    }

    public function getAll(): array
    {
        $stmt = $this->db->query("SELECT * FROM {$this->table}");
        return $stmt->fetchAll() ?: [];
    }
}
