<?php
// Main entry point and router for the application.
require_once __DIR__ . '/../app/controllers/UserController.php';
require_once __DIR__ . '/../app/controllers/GameController.php';
require_once __DIR__ . '/../app/controllers/AdminController.php';
require_once __DIR__ . '/../app/controllers/SearchController.php';
require_once __DIR__ . '/../app/helpers/auth.php';

class Router
{
    private string $basePath;

    public function __construct(string $basePath = '')
    {
        $this->basePath = $basePath;
    }

    private function getController(string $name)
    {
        if ($name === 'User') {
            return new UserController();
        } elseif ($name === 'Game') {
            return new GameController();
        } elseif ($name === 'Admin') {
            return new AdminController();
        } elseif ($name === 'Search') {
            return new SearchController();
        }
        throw new \Exception("Unknown controller: " . $name);
    }

    public function handle(string $url): void
    {
        $url = strtok($url, '?');

        if ($this->basePath && strpos($url, $this->basePath) === 0) {
            $url = substr($url, strlen($this->basePath));
        }

        $url = trim($url, '/');

        if (preg_match('/^@([a-zA-Z0-9_-]+)(?:\\?page=([a-z]+))?$/', $url, $matches)) {
            $username = $matches[1];
            $this->getController('User')->profileByUsername($username);
            return;
        }

        if (preg_match('/^game\/(\d+)$/', $url, $matches)) {
            $gameId = (int)$matches[1];
            $this->getController('Game')->show($gameId);
            return;
        }

        if (preg_match('/^game\/checkout\/(\d+)$/', $url, $matches)) {
            $gameId = (int)$matches[1];
            $this->getController('Game')->checkout($gameId);
            return;
        }

        if (preg_match('/^game\/claim\/(\d+)$/', $url, $matches)) {
            $gameId = (int)$matches[1];
            $this->getController('Game')->claim($gameId);
            return;
        }

        if (preg_match('/^game\/edit\/(\d+)$/', $url, $matches)) {
            $gameId = (int)$matches[1];
            if ($_SERVER['REQUEST_METHOD'] === 'POST') {
                $this->getController('Game')->update();
            } else {
                $this->getController('Game')->edit($gameId);
            }
            return;
        }

        if (preg_match('/^game\/download\/(\d+)$/', $url, $matches)) {
            $gameId = (int)$matches[1];
            $this->getController('Game')->download($gameId);
            return;
        }

        if (preg_match('/^game\/review\/(\d+)$/', $url, $matches)) {
            $gameId = (int)$matches[1];
            $this->getController('Game')->submitReview($gameId);
            return;
        }

        if (preg_match('/^admin\/(approve-review|reject-review|delete-review)\/(\d+)$/', $url, $matches)) {
            $methodName = $matches[1] === 'approve-review' ? 'approveReview' : ($matches[1] === 'reject-review' ? 'rejectReview' : 'deleteReview');
            $id = (int)$matches[2];
            $this->getController('Admin')->$methodName($id);
            return;
        }

        if (preg_match('/^game\/review\/(\d+)$/', $url, $matches)) {
            $gameId = (int)$matches[1];
            $this->getController('Game')->submitReview($gameId);
            return;
        }

        if ($url === '') {
            $this->getController('Game')->index();
            return;
        }
        $routes = [
            'admin/dashboard' => ['Admin', 'dashboard'],
            'admin/users' => ['Admin', 'listUsers'],
            'admin/reviews' => ['Admin', 'listReviews'],
            'admin/list_reviews' => ['Admin', 'listReviews'],
            'admin/games' => ['Admin', 'listGames'],
            'admin/manage-reviews' => ['Admin', 'manageReviews'],
            'admin/manage-games' => ['Admin', 'manageGames'],

            'search' => ['Search', 'index'],
            'login' => ['User', 'login'],
            'signup' => ['User', 'signup'],
            'logout' => ['User', 'logout'],
            'dashboard' => ['User', 'dashboard'],
            'profile/update' => ['User', 'update'],
            'profile/update-avatar' => ['User', 'updateAvatar'],
            'profile/change-password' => ['User', 'changePassword'],
            'games' => ['Game', 'index'],
            'game/create' => ['Game', 'create'],
            'game/store' => ['Game', 'store'],
            'process_payment' => ['Game', 'processPayment'],
            'support' => ['User', 'support'],
            'library' => ['Game', 'library'],
            'edit-games' => ['Game', 'editGames'],

            'api/chat_handler.php' => ['User', 'handleChat'],
        ];

        $handler = $routes[$url] ?? null;

        if ($handler) {
            $controllerName = $handler[0];
            $methodName = $handler[1];
            $this->getController($controllerName)->$methodName();
            return;
        }

        http_response_code(404);
        echo "Page not found: " . htmlspecialchars($url);
    }
}

$requestUrl = $_GET['url'] ?? '';
$basePath = '/sxumarcade/public';
(new Router($basePath))->handle($requestUrl);
