<?php
// app/models/OtpVerification.php
require_once __DIR__ . "/BaseModel.php";

class OtpVerification extends BaseModel
{
    protected string $table = "otp_verifications";

    public function create(
        int $userId, 
        string $email, 
        string $code, 
        string $type, 
        string $expiresAt
    ): int {
        $stmt = $this->db->prepare(
            "INSERT INTO {$this->table} (user_id, email, otp_code, otp_type, expires_at) 
             VALUES (:user_id, :email, :code, :type, :expires_at)"
        );
        $stmt->execute([$userId,$email,$code,$type,$expiresAt]);
        return $this->pdo->lastInsertId();
    }

    public function findValidOtp(
        string $email, 
        string $code, 
        string $type
    ): ?array {
        $stmt = $this->db->prepare(
            "SELECT * FROM {$this->table} 
             WHERE email = :email AND otp_code = :code AND otp_type = :type 
             AND used = 0 AND expires_at > NOW()"
        );
        $stmt->execute([$email,$code,$type]);
        return $stmt->fetch() ?: null;
    }

    public function markUsed(
        int $id
    ): bool {
        $stmt = $this->db->prepare("UPDATE otp_verifications SET used = 1 WHERE id = :id");
        return $stmt->execute(["id" => $id]);
    }

    public function getAll(): array
    {
        $stmt = $this->db->query("SELECT * FROM {$this->table}");
        return $stmt->fetchAll() ?: [];
    }
}
