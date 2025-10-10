<?php
// Manages user data, authentication, and profile information.
require_once __DIR__ . "/BaseModel.php";

class User extends BaseModel
{
    protected string $table = "users";

    public function create(
        string $username,
        string $email,
        string $passwordHash
    ): int {
        $stmt = $this->db->prepare(
            "INSERT INTO users (username, email, password_hash) VALUES (:username, :email, :password)"
        );
        $stmt->execute([$username, $email, $passwordHash]);
        return (int)$this->db->lastInsertId();
    }
    public function countAll(): int
    {
        $sql = "SELECT COUNT(*) FROM {$this->table}";
        $stmt = $this->db->query($sql);
        return (int)$stmt->fetchColumn();
    }

    public function searchByUsername(string $query): array
    {
        $sql = "SELECT username, avatar_url FROM users WHERE username LIKE :query";
        $stmt = $this->db->prepare($sql);
        $stmt->execute(['query' => "%{$query}%"]);
        return $stmt->fetchAll() ?: [];
    }
    public function findAll(): array
    {
        $sql = "SELECT id, username, email, is_admin, created_at, last_login
                FROM {$this->table}
                ORDER BY id DESC";
        $stmt = $this->db->query($sql);
        return $stmt->fetchAll() ?: [];
    }
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

    public function findByIdentifier(string $identifier): ?array
    {
        if (filter_var($identifier, FILTER_VALIDATE_EMAIL)) {
            return $this->findByEmail($identifier);
        } else {
            return $this->findByUserName($identifier);
        }
    }

    public function updateProfile(int $userId, array $data): bool
    {
        $fields = [];
        $params = [':id' => $userId];

        foreach ($data as $key => $value) {
            $fields[] = "{$key} = :{$key}";
            $params[":{$key}"] = $value;
        }

        if (empty($fields)) {
            return false;
        }

        $sql = "UPDATE users SET " . implode(', ', $fields) . " WHERE id = :id";

        try {
            $stmt = $this->db->prepare($sql);
            return $stmt->execute($params);
        } catch (\PDOException $e) {
            error_log("Profile update failed: " . $e->getMessage());
            return false;
        }
    }

    public function updateAvatarPath(int $userId, string $path): bool
    {
        $sql = "UPDATE users SET avatar_url = :path WHERE id = :id";

        try {
            $stmt = $this->db->prepare($sql);
            return $stmt->execute([
                ':path' => $path,
                ':id'   => $userId
            ]);
        } catch (\PDOException $e) {
            error_log("Avatar path update failed: " . $e->getMessage());
            return false;
        }
    }

    public function updateLastLogin(int $id): bool
    {
        $stmt = $this->db->prepare("UPDATE users SET last_login = NOW() WHERE id = :id");
        return $stmt->execute(["id" => $id]);
    }

    public function verifyEmail(int $id): bool
    {
        $stmt = $this->db->prepare("UPDATE users SET email_verified = 1 WHERE id = :id");
        return $stmt->execute(["id" => $id]);
    }

    public function changePassword(int $id, string $newPasswordHash): bool
    {
        $stmt = $this->db->prepare("UPDATE users SET password_hash = :newPasswordHash WHERE id = :id");
        return $stmt->execute([
            "newPasswordHash" => $newPasswordHash,
            "id" => $id
        ]);
    }

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

    public function isAdmin(int $id): bool
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
