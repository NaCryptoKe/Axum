<?php
require_once __DIR__ . '/BaseModel.php';

class UserSession extends BaseModel
{
    protected string $table = "user_sessions";
    
    public function createSession($user_id, $token, $expires_at, $ip, $ua) {
        $stmt = $this->db->prepare("INSERT INTO {$this->table} (user_id, session_token, expires_at, ip_address, user_agent) VALUES (?, ?, ?, ?, ?)");
        return $stmt->execute([$user_id, $token, $expires_at, $ip, $ua]);
    }

    public function findByToken($token) {
        $stmt = $this->db->prepare("SELECT * FROM {$this->table} WHERE session_token = ?");
        $stmt->execute([$token]);
        return $stmt->fetch();
    }

    public function verifySession($token, $ip, $ua) {
        $stmt = $this->db->prepare("SELECT * FROM {$this->table} WHERE session_token = ? AND ip_address = ? AND user_agent = ? AND expires_at > NOW()");
        $stmt->execute([$token, $ip, $ua]);
        return $stmt->fetch();
    }

    public function deleteByToken($token) {
        $stmt = $this->db->prepare("DELETE FROM {$this->table} WHERE session_token = ?");
        return $stmt->execute([$token]);
    }

    public function deleteExpired() {
        $stmt = $this->db->prepare("DELETE FROM {$this->table} WHERE expires_at < NOW()");
        return $stmt->execute();
    }

    public function getAll(): array
    {
        $stmt = $this->db->query("SELECT * FROM {$this->table}");
        return $stmt->fetchAll() ?: [];
    }
}
