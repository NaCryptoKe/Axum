<?php
// Handles game purchases and ownership records.
require_once __DIR__ . '/BaseModel.php';

class Purchase extends BaseModel
{
    protected string $table = "purchases";

    public function getLastFiveGames(int $userId): array
    {
        $sql = "
        SELECT g.id, g.title, g.cover_url
        FROM purchases p
        JOIN games g ON p.game_id = g.id
        WHERE p.user_id = :user_id
        ORDER BY p.purchased_at DESC
        LIMIT 5
    ";

        $stmt = $this->db->prepare($sql);
        $stmt->execute([':user_id' => $userId]);

        return $stmt->fetchAll(PDO::FETCH_ASSOC) ?: [];
    }

    public function record(
        int $user_id,
        int $game_id,
        string $type,
        float $amount,
        string $transaction_no
    ): bool {
        $sql = "INSERT INTO {$this->table}
                (user_id, game_id, purchase_type, amount_paid, transaction_no)
                VALUES (?, ?, ?, ?, ?)";
        $stmt = $this->db->prepare($sql);
        return $stmt->execute([$user_id, $game_id, $type, $amount, $transaction_no]);
    }

    public function checkTransactionReuse(string $transactionNo): bool
    {
        $sql = "SELECT 1 FROM {$this->table} WHERE transaction_no = ? LIMIT 1";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$transactionNo]);
        return $stmt->fetch() !== false;
    }

    public function checkOwnership(int $user_id, int $game_id): bool
    {
        $sql = "SELECT 1 FROM {$this->table} WHERE user_id = ? AND game_id = ? LIMIT 1";
        $stmt = $this->db->prepare($sql);
        $stmt->execute([$user_id, $game_id]);
        return $stmt->fetch() !== false;
    }

    public function hasPurchased(int $user_id, int $game_id): bool
    {
        return $this->checkOwnership($user_id, $game_id);
    }

    public function getUserPurchases(int $user_id): array
    {
        $stmt = $this->db->prepare("SELECT * FROM {$this->table} WHERE user_id = ?");
        $stmt->execute([$user_id]);
        return $stmt->fetchAll() ?: [];
    }

    public function getUserGames(int $userId): array
    {
        $sql = "
        SELECT g.*
        FROM purchases p
        JOIN games g ON p.game_id = g.id
        WHERE p.user_id = :user_id
        ORDER BY g.created_at DESC
    ";

        $stmt = $this->db->prepare($sql);
        $stmt->execute([':user_id' => $userId]);

        return $stmt->fetchAll() ?: [];
    }

    public function getGamePurchases(int $game_id): array
    {
        $stmt = $this->db->prepare("SELECT * FROM {$this->table} WHERE game_id = ?");
        $stmt->execute([$game_id]);
        return $stmt->fetchAll() ?: [];
    }

    public function getTotalRevenue(): float
    {
        $stmt = $this->db->query("SELECT SUM(amount_paid) AS total_revenue FROM {$this->table}");
        $result = $stmt->fetch();
        return $result ? (float)$result['total_revenue'] : 0.0;
    }

    public function getTotalRevenueForGame(int $game_id): float
    {
        $stmt = $this->db->prepare("SELECT SUM(amount_paid) AS total_revenue FROM {$this->table} WHERE game_id = ?");
        $stmt->execute([$game_id]);
        $result = $stmt->fetch();
        return $result ? (float)$result['total_revenue'] : 0.0;
    }

    public function getTotalPurchases(): int
    {
        $stmt = $this->db->query("SELECT COUNT(*) AS total_purchases FROM {$this->table}");
        $result = $stmt->fetch();
        return $result ? (int)$result['total_purchases'] : 0;
    }

    public function getTotalPurchasesForGame(int $game_id): int
    {
        $stmt = $this->db->prepare("SELECT COUNT(*) AS total_purchases FROM {$this->table} WHERE game_id = ?");
        $stmt->execute([$game_id]);
        $result = $stmt->fetch();
        return $result ? (int)$result['total_purchases'] : 0;
    }

    public function getPurchasesInLastDays(int $days): array
    {
        $stmt = $this->db->prepare("SELECT * FROM {$this->table} WHERE purchase_date >= NOW() - INTERVAL ? DAY");
        $stmt->execute([$days]);
        return $stmt->fetchAll() ?: [];
    }

    public function getPurchasesInLastDaysForGame(int $game_id, int $days): array
    {
        $stmt = $this->db->prepare("SELECT * FROM {$this->table} WHERE game_id = ? AND purchase_date >= NOW() - INTERVAL ? DAY");
        $stmt->execute([$game_id, $days]);
        return $stmt->fetchAll() ?: [];
    }

    public function getRevenueInLastDays(int $days): float
    {
        $stmt = $this->db->prepare("SELECT SUM(amount_paid) AS total_revenue FROM {$this->table} WHERE purchase_date >= NOW() - INTERVAL ? DAY");
        $stmt->execute([$days]);
        $result = $stmt->fetch();
        return $result ? (float)$result['total_revenue'] : 0.0;
    }

    public function getRevenueByGame(): array
    {
        $stmt = $this->db->query("SELECT game_id, SUM(amount_paid) AS total_revenue FROM {$this->table} GROUP BY game_id");
        return $stmt->fetchAll() ?: [];
    }

    public function getRevenueInLastDaysByGame(int $days): array
    {
        $stmt = $this->db->prepare("SELECT game_id, SUM(amount_paid) AS total_revenue FROM {$this->table} WHERE purchase_date >= NOW() - INTERVAL ? DAY GROUP BY game_id");
        $stmt->execute([$days]);
        return $stmt->fetchAll() ?: [];
    }

    public function changePurchaseType(int $purchase_id): bool
    {
        $stmt = $this->db->prepare("UPDATE {$this->table} SET purchase_type = 'claimed' WHERE id = ?");
        return $stmt->execute([$purchase_id]);
    }

    public function recordPurchase(int $userId, int $gameId, float $amount, string $paymentMethod = 'manual'): bool
    {
        $stmt = $this->db->prepare("
        INSERT INTO purchases (user_id, game_id, amount, payment_method)
        VALUES (:user_id, :game_id, :amount, :payment_method)
    ");
        return $stmt->execute([
            'user_id' => $userId,
            'game_id' => $gameId,
            'amount' => $amount,
            'payment_method' => $paymentMethod
        ]);
    }

    public function getAll(): array
    {
        $stmt = $this->db->query("SELECT * FROM {$this->table}");
        return $stmt->fetchAll() ?: [];
    }
}
