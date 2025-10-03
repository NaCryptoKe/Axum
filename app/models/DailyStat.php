<?php
require_once __DIR__ . '/BaseModel.php';

class DailyStat extends BaseModel 
{
    protected string $table = "daily_stats";

    public function getAll(): array
    {
        $stmt = $this->db->query("SELECT * FROM {$this->table}");
        return $stmt->fetchAll() ?: [];
    }
}
