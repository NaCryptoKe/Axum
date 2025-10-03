<?php
// app/models/User.php
require_once __DIR__ . "/BaseModel.php";

class User extends BaseModel
{
    protected string $table = "users";
    
    // ========== Create Operations ==========
    public function create(
        string $username, 
        string $email, 
        string $passwordHash
    ): int {
        $stmt = $this->db->prepare(
            "INSERT INTO users (username, email, password_hash) VALUES (:username, :email, :password)"
        );
        $stmt->execute([$username,$email, $passwordHash]);
        return (int)$this->db->lastInsertId();
    }

    // ========== Find Operations ==========
    public function findById(int $id): ?array
    {
        $stmt = $this->db->prepare("SELECT * FROM users WHERE id = :id");
        $stmt->execute(["id" => $id]);
        return $stmt->fetch() ?: null;
    }
    
    public function findByUserName(string $username): ?array
    {
        $stmt = $this->db->prepare("SELECT * FROM users WHERE username = :username");
        $stmt->execute(["username" => $username]);
        return $stmt->fetch() ?: null;
    }

    public function findByEmail(string $email): ?array
    {
        $stmt = $this->db->prepare("SELECT * FROM users WHERE email = :email");
        $stmt->execute(["email" => $email]);
        return $stmt->fetch() ?: null;
    }

    public function findByIdentifier($identifier)
    {
        if (filter_var($identifier, FILTER_VALIDATE_EMAIL)) {
            return $this->findByEmail($identifier);
        } else {
            return $this->findByUserName($identifier);
        }
    }

    // ========== Updte Operations ==========
    public function updateLastLogin(int $id): bool
    {
        $stmt = $this->db->prepare("UPDATE users SET last_login = NOW() WHERE id = :id");
        return $stmt->execute(["id" => $id]);
    }

    public function updateProfile(?int $id, ?string $username, ?string $bio, ?string $avatarUrl,):bool
    {
        $stmt = $this->db->prepare("UPDATE users SET username = :username, bio, avatar_url = :avatarUrl WHERE id = :id");
        return $stmt-> execute([
            "username" => $username,
            "bio" => $bio,
            "avatarUrl" => $avatarUrl,
            "id" => $id
        ]);
    }

    public function verifyEmail(int $id) : bool
    {
        $stmt = $this-> db -> prepare("UPDATE users SET email_verified = 1 WHERE id = :id");
        return $stmt -> execute(["id" => $id]);
    }

    public function changePassword(int $id, string $newPasswordHash) : bool
    {
        $stmt = $this -> db -> prepare ("UPDATE users SET password_hash = :newPasswordHash WHERE id = :id");
        return $stmt -> execute ([
            "newPasswordHash" => $newPasswordHash,
            "id" => $id
        ]);
    }


    // ========== Admin Related ==========
    public function promoteToAdmin(int $id): bool
    {
        $stmt = $this->db->prepare("UPDATE users SET is_admin = 1 WHERE id = :id");
        return $stmt->execute(["id" => $id]);
    }

    public function demoteFromAdmin(int $id): bool
    {
        $stmt = $this->db->prepare("UPDATE users SET is_admin = 0 WHERE id = :id");
        return $stmt->execute(["id" => $id]);
    }

    public function isAdmin(int $id) : bool
    {
        $stmt = $this->db->prepare("SELECT is_admin FROM users WHERE id = :id");
        $stmt->execute(["id" => $id]);
        $result = $stmt->fetch();
        return $result && (bool)$result['is_admin'];
    }
    public function getAll(): array
    {
        $stmt = $this->db->query("SELECT * FROM {$this->table}");
        return $stmt->fetchAll() ?: [];
    }
}
