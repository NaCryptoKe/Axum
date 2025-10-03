<?php
require_once __DIR__ . '/BaseModel.php';

class ModerationAction extends BaseModel
{
    protected string $table = "moderation_actions";

    public function log(
        $admin_id, 
        $target_type, 
        $target_id, 
        $action, 
        $reason = null, 
        $duration = null
    ) : bool {
        $stmt = $this->db->prepare("INSERT INTO {$this->table} (admin_user_id, target_type, target_id, action_type, reason, duration_days) VALUES (?, ?, ?, ?, ?, ?)");
        return $stmt->execute([$admin_id, $target_type, $target_id, $action, $reason, $duration]);
    }

    public function getAll(): array
    {
        $stmt = $this->db->query("SELECT * FROM {$this->table}");
        return $stmt->fetchAll() ?: [];
    }
}
