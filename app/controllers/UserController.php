<?php
// Controller for user-related actions like login, signup, and profile management.
require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../helpers/auth.php';

class UserController
{
    private $basePath = '/sxumarcade/public';

    public function getCurrentUserData(): array
    {
        $userId = currentUserId();
        if (!$userId) {
            return [];
        }

        $userModel = new User();
        $userData = $userModel->findById($userId);

        return $userData ?: [];
    }

    public function getUserDataByUsername(string $username): array
    {
        $userModel = new User();
        $userData = $userModel->findByUserName($username);

        return $userData ?: [];
    }

    public function profileByUsername(string $username): void
    {
        $page = $_GET['page'] ?? 'overview';
        $userData = $this->getUserDataByUsername($username);

        if (!$userData) {
            http_response_code(404);
            echo "User not found";
            return;
        }

        $currentUser = $this->getCurrentUserData();
        $isOwnProfile = !empty($currentUser) && $currentUser['username'] === $username;

        $filepath = $userData['avatar_url'] ?? "{$this->basePath}/uploads/avatars/default.png";

        $recentGames = [];
        require_once __DIR__ . '/../models/Purchase.php';
        $purchaseModel = new Purchase();
        $recentGames = $purchaseModel->getLastFiveGames($userData['id'] ?? 0);

        $profileViewPath = __DIR__ . "/../../views/user/profile.php";
        require $profileViewPath;
    }

    public function profilePage(string $username, string $page): void
    {
        $userData = $this->getUserDataByUsername($username);

        if (!$userData) {
            http_response_code(404);
            echo "User not found";
            return;
        }

        $currentUser = $this->getCurrentUserData();
        $isOwnProfile = !empty($currentUser) && $currentUser['username'] === $username;

        $filepath = $userData['avatar_url'] ?? "{$this->basePath}/uploads/avatars/default.png";

        $viewPath = null;
        switch ($page) {
            case 'games':
                $viewPath = __DIR__ . "/../../views/user/profile_games.php";
                break;
            case 'friends':
                $viewPath = __DIR__ . "/../../views/user/profile_friends.php";
                break;
            case 'settings':
                if (!$isOwnProfile) {
                    header("Location: {$this->basePath}/@{$username}");
                    exit;
                }
                $viewPath = __DIR__ . "/../../views/user/profile_settings.php";
                break;
            default:
                header("Location: {$this->basePath}/@{$username}");
                exit;
        }

        if ($viewPath && file_exists($viewPath)) {
            require $viewPath;
        } else {
            header("Location: {$this->basePath}/@{$username}");
            exit;
        }
    }

    public function header(?array $userData = null): void
    {
        if ($userData === null) {
            $userData = $this->getCurrentUserData();
        }

        $filepath = $userData['avatar_url'] ?? "{$this->basePath}/uploads/avatars/default.png";

        $headerPath = __DIR__ . "/../../views/layout/header.php";

        if (!file_exists($headerPath)) {
            echo "Header not found: " . htmlspecialchars($headerPath);
            return;
        }

        require $headerPath;
    }

    public function login(): void
    {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $identifier = trim($_POST['identifier'] ?? '');
            $password   = $_POST['password'] ?? '';

            $userModel = new User();
            $user = $userModel->findByIdentifier($identifier);

            if ($user && password_verify($password, $user['password_hash'])) {
                loginUser($user['id']);
                header("Location: {$this->basePath}/@{$user['username']}");
                exit;
            } else {
                $this->showLoginForm("❌ Invalid email, username, or password.");
                return;
            }
        }

        $this->showLoginForm();
    }

    public function showLoginForm(?string $error = null): void
    {
        $errorMessage = $error;
        $loginViewPath = __DIR__ . "/../../views/user/login.php";

        if (!file_exists($loginViewPath)) {
            echo "Login view not found. Please create: " . htmlspecialchars($loginViewPath);
            return;
        }

        require $loginViewPath;
    }

    public function signup(): void
    {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $username = trim($_POST['username'] ?? '');
            $email = trim($_POST['email'] ?? '');
            $password = $_POST['password'] ?? '';

            if (!$username || !$email || !$password) {
                $this->showSignupForm("❌ All fields are required.");
                return;
            }

            $hashed_password = password_hash($password, PASSWORD_BCRYPT);
            $userModel = new User();

            $existingUserName = $userModel->findByUserName($username);
            $existingEmail = $userModel->findByEmail($email);

            if ($existingUserName) {
                $this->showSignupForm("❌ Username already taken.");
                return;
            }

            if ($existingEmail) {
                $this->showSignupForm("❌ Email already registered.");
                return;
            }

            $userId = $userModel->create($username, $email, $hashed_password);
            loginUser($userId);
            header("Location: {$this->basePath}/@{$username}");
            exit;
        }

        $this->showSignupForm();
    }

    public function showSignupForm(?string $error = null): void
    {
        $errorMessage = $error;
        $signupViewPath = __DIR__ . "/../../views/user/signup.php";

        if (!file_exists($signupViewPath)) {
            echo "Signup view not found. Please create: " . htmlspecialchars($signupViewPath);
            return;
        }

        require $signupViewPath;
    }

    public function signupGoogle(): void
    {
    }

    public function logout(): void
    {
        logoutUser();
        header("Location: {$this->basePath}/login");
        exit;
    }

    public function dashboard(): void
    {
        requireLogin();

        $userData = $this->getCurrentUserData();

        if (!$userData) {
            logoutUser();
            header("Location: {$this->basePath}/login.php");
            exit;
        }

        header("Location: {$this->basePath}/@" . $userData['username']);
        exit;
    }

    public function home(): void
    {
        header("Location: {$this->basePath}/login.php");
        exit;
    }

    public function handleDirectAccess(): void
    {
        $requestUri = $_SERVER['REQUEST_URI'];

        if (strpos($requestUri, '.php') !== false) {
            if (strpos($requestUri, 'login.php') !== false) {
                header("Location: {$this->basePath}/login");
                exit;
            } elseif (strpos($requestUri, 'signup.php') !== false) {
                header("Location: {$this->basePath}/signup");
                exit;
            } elseif (strpos($requestUri, 'dashboard.php') !== false) {
                $userData = $this->getCurrentUserData();
                if ($userData) {
                    header("Location: {$this->basePath}/@{$userData['username']}");
                } else {
                    header("Location: {$this->basePath}/login.php");
                }
                exit;
            }
        }

        http_response_code(404);
        echo "Page not found";
    }

    public function update(): void
    {
        requireLogin();

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $userId = currentUserId();
            $userModel = new User();
            $userData = $userModel->findById($userId);

            if (!$userData) {
                header("Location: {$this->basePath}/login?error=Invalid+session");
                exit;
            }

            $newUsername = trim($_POST['username'] ?? '');
            $newBio = trim($_POST['bio'] ?? '');
            $currentUsername = $userData['username'];
            $error = null;

            if (empty($newUsername) || strlen($newUsername) < 3) {
                $error = "Username must be at least 3 characters long.";
            } else {
                if ($newUsername !== $currentUsername) {
                    $existingUser = $userModel->findByUserName($newUsername);
                    if ($existingUser) {
                        $error = "That username is already taken by another user.";
                    }
                }
            }

            if (!$error) {
                $updateData = [
                    'username' => $newUsername,
                    'bio' => $newBio
                ];

                $success = $userModel->updateProfile($userId, $updateData);

                if ($success) {
                    header("Location: {$this->basePath}/@{$newUsername}?message=Profile+updated+successfully");
                    exit;
                } else {
                    $error = "Failed to update profile. Try a different username or check database connection.";
                }
            }

            if ($error) {
                header("Location: {$this->basePath}/@{$currentUsername}?page=settings&error=" . urlencode($error));
                exit;
            }
        } else {
            header("Location: {$this->basePath}/@{$userData['username']}?page=settings");
            exit;
        }
    }

    private function handleAvatarUpload($userId): ?string
    {
        $maxFileSize = 2 * 1024 * 1024;
        if (isset($_FILES['avatar']) && $_FILES['avatar']['error'] === UPLOAD_ERR_OK) {
            $uploadDir = __DIR__ . "/../../public/uploads/avatars/";

            if (!is_dir($uploadDir)) {
                mkdir($uploadDir, 0755, true);
            }

            $extension = pathinfo($_FILES['avatar']['name'], PATHINFO_EXTENSION);
            $allowedTypes = ['jpg', 'jpeg', 'png', 'gif'];
            if (!in_array(strtolower($extension), $allowedTypes)) {
                return null;
            }

            if ($_FILES['avatar']['size'] > $maxFileSize) {
                return null;
            }

            $filename = "user_{$userId}_" . time() . ".{$extension}";
            $filename = preg_replace("/[^A-Za-z0-9\.]/", '_', $filename);
            $filepath = $uploadDir . $filename;

            if (move_uploaded_file($_FILES['avatar']['tmp_name'], $filepath)) {
                return "{$this->basePath}/uploads/avatars/{$filename}";
            }
        }
        return null;
    }

    public function showProfileSettings(?string $error = null): void
    {
        requireLogin();

        $userData = $this->getCurrentUserData();
        if (!$userData) {
            header("Location: {$this->basePath}/login");
            exit;
        }

        $filepath = $userData['avatar_url'] ?? "{$this->basePath}/uploads/avatars/default.png";
        $errorMessage = $error;

        require __DIR__ . "/../../views/user/profile_settings.php";
    }

    public function changePassword(): void
    {
        requireLogin();

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $userId = currentUserId();
            $currentPassword = $_POST['current_password'] ?? '';
            $newPassword = $_POST['new_password'] ?? '';

            $userModel = new User();
            $userData = $userModel->findById($userId);

            if ($userData && password_verify($currentPassword, $userData['password_hash'])) {
                $newPasswordHash = password_hash($newPassword, PASSWORD_BCRYPT);
                $success = $userModel->changePassword($userId, $newPasswordHash);

                if ($success) {
                    header("Location: {$this->basePath}/@{$userData['username']}?message=Password+changed+successfully");
                    exit;
                } else {
                    $error = "Failed to change password";
                }
            } else {
                $error = "Current password is incorrect";
            }
        }

        $this->showProfileSettings($error ?? null);
    }

    public function support(): void
    {
        $userData = $this->getCurrentUserData();
        $filepath = $userData['avatar_url'] ?? "{$this->basePath}/uploads/avatars/default.png";
        include __DIR__ . "/../../views/others/support.php";
    }

    public function updateAvatarPath(int $userId, string $path): bool
    {
        $sql = "UPDATE users SET avatar_path = :path WHERE id = :id";

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

    public function updateAvatar(): void
    {
        requireLogin();

        $userId = currentUserId();
        $userModel = new User();
        $userData = $userModel->findById($userId);

        if (!$userData) {
            header("Location: {$this->basePath}/login?error=Invalid+session");
            exit;
        }

        $newAvatarPath = $this->handleAvatarUpload($userId);

        if ($newAvatarPath) {
            $success = $userModel->updateAvatarPath($userId, $newAvatarPath);
            if ($success) {
                header("Location: {$this->basePath}/@{$userData['username']}?message=Avatar+updated+successfully");
                exit;
            } else {
                header("Location: {$this->basePath}/@{$userData['username']}?error=Database+update+failed");
                exit;
            }
        } else {
            header("Location: {$this->basePath}/@{$userData['username']}?error=Invalid+or+failed+file+upload");
            exit;
        }
    }
}
