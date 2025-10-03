<?php
require_once __DIR__ . '/BaseModel.php';

class Purchase extends BaseModel
{
    protected string $table = "purchases";
    
    public function record(
        $user_id, 
        $game_id, 
        $type, 
        $amount
    ) : bool {
        $stmt = $this->db->prepare("INSERT INTO {$this->table} (user_id, game_id, purchase_type, amount_paid, purchase_type) VALUES (?, ?, ?, ?, 'bought')");
        return $stmt->execute([$user_id, $game_id, $type, $amount]);
    }

    public function checkOwnership(
        $user_id, 
        $game_id
    ) : bool {
        $stmt = $this->db->prepare("SELECT * FROM {$this->table} WHERE user_id=? AND game_id=?");
        $stmt->execute([$user_id, $game_id]);
        return $stmt->fetch();
    }

    public function getUserPurchases(
        $user_id
    ) : array{
        $stmt = $this->db->prepare("SELECT * FROM {$this->table} WHERE user_id=?");
        $stmt->execute([$user_id]);
        return $stmt->fetchAll() ?: [];
    }

    public function getGamePurchases(
        $game_id
    ) : array {
        $stmt = $this->db->prepare("SELECT * FROM {$this->table} WHERE game_id=?");
        $stmt->execute([$game_id]);
        return $stmt->fetchAll() ?: [];
    }

    public function getTotalRevenue() : float {
        $stmt = $this->db->query("SELECT SUM(amount_paid) as total_revenue FROM {$this->table}");
        $result = $stmt->fetch();
        return $result ? (float)$result['total_revenue'] : 0.0;
    }

    public function getTotalRevenueForGame($game_id) : float {
        $stmt = $this->db->prepare("SELECT SUM(amount_paid) as total_revenue FROM {$this->table} WHERE game_id=?");
        $stmt->execute([$game_id]);
        $result = $stmt->fetch();
        return $result ? (float)$result['total_revenue'] : 0.0;
    }

    public function getTotalPurchases() : int {
        $stmt = $this->db->query("SELECT COUNT(*) as total_purchases FROM {$this->table}");
        $result = $stmt->fetch();
        return $result ? (int)$result['total_purchases'] : 0;
    }

    public function getTotalPurchasesForGame(
        $game_id
    ) : int {
        $stmt = $this->db->prepare("SELECT COUNT(*) as total_purchases FROM {$this->table} WHERE game_id=?");
        $stmt->execute([$game_id]);
        $result = $stmt->fetch();
        return $result ? (int)$result['total_purchases'] : 0;
    }

    public function getPurchasesInLastDays(
        $days
    ): array {
        $stmt = $this->db->prepare("SELECT * FROM {$this->table} WHERE purchase_date >= NOW() - INTERVAL ? DAY");
        $stmt->execute([$days]);
        return $stmt->fetchAll() ?: [];
    }

    public function getPurchasesInLastDaysForGame($game_id, $days): array {
        $stmt = $this->db->prepare("SELECT * FROM {$this->table} WHERE game_id=? AND purchase_date >= NOW() - INTERVAL ? DAY");
        $stmt->execute([$game_id, $days]);
        return $stmt->fetchAll() ?: [];
    }

    public function getRevenueInLastDays($days): float {
        $stmt = $this->db->prepare("SELECT SUM(amount_paid) as total_revenue FROM {$this->table} WHERE purchase_date >= NOW() - INTERVAL ? DAY");
        $stmt->execute([$days]);
        $result = $stmt->fetch();
        return $result ? (float)$result['total_revenue'] : 0.0;
    }

    public function getRevenueByGame(): array {
        $stmt = $this->db->query("SELECT game_id, SUM(amount_paid) as total_revenue FROM {$this->table} GROUP BY game_id");
        return $stmt->fetchAll() ?: [];
    }

    public function getRevenueInLastDaysByGame($days): array {
        $stmt = $this->db->prepare("SELECT game_id, SUM(amount_paid) as total_revenue FROM {$this->table} WHERE purchase_date >= NOW() - INTERVAL ? DAY GROUP BY game_id");
        $stmt->execute([$days]);
        return $stmt->fetchAll() ?: [];
    }

    public function changePurchaseType(
        $purchase_id): bool {
        $stmt = $this->db->prepare("UPDATE {$this->table} SET purchase_type = 'claimed' WHERE id = ?");
        return $stmt->execute([$purchase_id]);
    }

    public function getAll(): array
    {
        $stmt = $this->db->query("SELECT * FROM {$this->table}");
        return $stmt->fetchAll() ?: [];
    }
}
