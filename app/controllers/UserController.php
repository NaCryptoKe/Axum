<?php
// UserController.php
require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../helpers/auth.php';

class UserController
{
    public function login()
    {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $identifier = $_POST['identifier'] ?? '';
            $password   = $_POST['password'] ?? '';

            $userModel = new User();
            $user = $userModel->findByIdentifier($identifier);

            if ($user && password_verify($password, $user['password_hash'])) {
                loginUser($user['id']); // from helpers/auth.php
                header("Location: dashboard.php");
                exit;
            } else {
                $this->showLoginForm("❌ Invalid email, username or password.");
            }
        }
    }

    public function showLoginForm(?string $error = null): void
    {
        // Pass error variable to view
        $errorMessage = $error;
        require __DIR__ . "/../../views/user/login.php";
    }

    public function signup()
    {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $username = $_POST['username'] ?? '';
            $email = $_POST['email'] ?? '';
            $password = $_POST['password'] ?? '';

            $hashed_password = password_hash($password, PASSWORD_BCRYPT);

            $userModel = new User();
            $existingUserName = $userModel -> findByUserName($username);
            $existingEmail = $userModel -> findByEmail($email);

            if ($existingUserName) {
                $this->showLoginForm("❌ Username already taken.");
                return;
            } else if ($existingEmail) {
                $this->showLoginForm("❌ Email already registered.");
                return;
            } else {
                $userId = $userModel -> create($username, $email, $hashed_password);
                loginUser($userId);
                header("Location: dashboard.php");
                exit;
            }
        }
    }

    public function showSignupForm(?string $error = null): void
    {
        // Pass error variable to view
        $errorMessage = $error;
        require __DIR__ . "/../../views/user/signup.php";
    }

    public function signupGoogle()
    {
    }

    public function logout(): void
    {
        logoutUser();
        header("Location: login.php");
        exit;
    }

    public function dashboard(): void
    {
        requireLogin();
        $userId = currentUserId();

        $userModel = new User();
        $userData  = $userModel->findById($userId);

        // Fallback avatar if none set
        $filepath = $userData['avatar_url'] ?? "./uploads/avatars/admin.jpg";

        // Pass data to the view
        require __DIR__ . "/../../views/user/dashboard.php";
    }

}

