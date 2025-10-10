<?php
// Manages game categories in the database.
require_once __DIR__ . '/BaseModel.php';

class Category extends BaseModel
{
    protected string $table = "categories";

    public function create(
        $name,
        $desc = null
    ): bool {
        $stmt = $this->db->prepare("INSERT INTO {$this->table} (name, description) VALUES (?, ?)");
        return $stmt->execute([$name, $desc]);
    }

    public function findById(
        $id
    ): array {
        $stmt = $this->db->prepare("SELECT * FROM {$this->table} WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch() ?: [];
    }

    public function editDescription(
        $id,
        $desc
    ): bool {
        $stmt = $this->db->prepare("UPDATE {$this->table} SET description = ? WHERE id = ?");
        return $stmt->execute([$desc, $id]);
    }

    public function getAll(): array
    {
        $stmt = $this->db->query("SELECT * FROM {$this->table}");
        return $stmt->fetchAll() ?: [];
    }
}
