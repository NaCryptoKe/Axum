<?php
// Handles game-related actions like creation, display, and purchase.
require_once __DIR__ . '/../models/Game.php';
require_once __DIR__ . '/../models/Category.php';
require_once __DIR__ . '/../models/GameCategory.php';
require_once __DIR__ . '/../helpers/auth.php';
require_once __DIR__ . '/../models/Review.php';
require_once __DIR__ . '/../models/User.php';
require_once __DIR__ . '/../models/Purchase.php';

class GameController
{
    private $basePath = '/sxumarcade/public';

    public function create(): void
    {
        requireLogin();

        $categoryModel = new Category();
        $categories = $categoryModel->getAll();

        require __DIR__ . "/../../views/game/create.php";
    }

    public function store(): void
    {
        requireLogin();

        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $userId = currentUserId();
            $title = trim($_POST['title'] ?? '');
            $description = trim($_POST['description'] ?? '');
            $shortDescription = trim($_POST['short_description'] ?? '');
            $price = floatval($_POST['price'] ?? 0);
            $categories = $_POST['categories'] ?? [];

            if (empty($title) || empty($description)) {
                $error = "Title and description are required";
                $this->showCreateForm($error, $categories);
                return;
            }

            $coverUrl = $this->handleCoverUpload();
            $fileUrl = $this->handleGameFileUpload();

            if (!$coverUrl) {
                $error = "Cover image is required";
                $this->showCreateForm($error, $categories);
                return;
            }

            if (!$fileUrl) {
                $error = "Game file is required";
                $this->showCreateForm($error, $categories);
                return;
            }

            $gameModel = new Game();
            $gameId = $gameModel->create($userId, $title, $description, $coverUrl, $fileUrl, $price, '1.0', $shortDescription);

            if ($gameId) {
                if (!empty($categories)) {
                    $gameCategoryModel = new GameCategory();
                    foreach ($categories as $categoryId) {
                        $gameCategoryModel->assign($gameId, $categoryId);
                    }
                }

                header("Location: {$this->basePath}/game/{$gameId}");
                exit;
            } else {
                $error = "Failed to create game";
                $this->showCreateForm($error, $categories);
            }
        }
    }

    private function handleCoverUpload(): ?string
    {
        if (!isset($_FILES['cover_image']) || $_FILES['cover_image']['error'] !== UPLOAD_ERR_OK) {
            return null;
        }

        $uploadDir = __DIR__ . "/../../public/uploads/covers/";

        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        $file = $_FILES['cover_image'];
        $extension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        $allowedTypes = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

        if (!in_array($extension, $allowedTypes)) {
            return null;
        }

        if ($file['size'] > 5 * 1024 * 1024) {
            return null;
        }

        $filename = "cover_" . uniqid() . "_" . time() . ".{$extension}";
        $filepath = $uploadDir . $filename;

        if (move_uploaded_file($file['tmp_name'], $filepath)) {
            return "{$this->basePath}/uploads/covers/{$filename}";
        }

        return null;
    }

    private function handleGameFileUpload(): ?string
    {
        if (!isset($_FILES['game_file']) || $_FILES['game_file']['error'] !== UPLOAD_ERR_OK) {
            return null;
        }

        $uploadDir = __DIR__ . "/../../public/uploads/games/";

        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        $file = $_FILES['game_file'];
        $originalName = $file['name'];
        $extension = strtolower(pathinfo($originalName, PATHINFO_EXTENSION));
        $allowedTypes = ['zip', 'rar', '7z', 'exe', 'apk', 'ipa'];

        if (!in_array($extension, $allowedTypes)) {
            return null;
        }

        if ($file['size'] > 100 * 1024 * 1024) {
            return null;
        }

        $filename = "game_" . uniqid() . "_" . time() . ".{$extension}";
        $filepath = $uploadDir . $filename;

        if (move_uploaded_file($file['tmp_name'], $filepath)) {
            return "{$this->basePath}/uploads/games/{$filename}";
        }

        return null;
    }

    private function showCreateForm(?string $error = null, ?array $selectedCategories = null): void
    {
        $categoryModel = new Category();
        $categories = $categoryModel->getAll();
        $errorMessage = $error;

        require __DIR__ . "/../../views/game/create.php";
    }

    public function show(int $gameId): void
    {
        $gameModel = new Game();
        $reviewModel = new Review();
        $userModel = new User();

        $gameData = $gameModel->findById($gameId);

        if (!$gameData) {
            http_response_code(404);
            include __DIR__ . "/../../views/game/view.php";
            return;
        }

        $developer = $userModel->findById($gameData['user_id'] ?? 0);
        $gameData['developer_username'] = $developer['username'] ?? null;

        $reviews = $reviewModel->findApprovedByGameId($gameId);

        $averageRating = (float)($gameData['average_rating'] ?? 0.0);
        $reviewCount = (int)($gameData['review_count'] ?? 0);

        $userHasReviewed = false;
        if (currentUserId()) {
            $userHasReviewed = $reviewModel->hasUserReviewedGame(currentUserId(), $gameId);
        }

        include __DIR__ . "/../../views/game/view.php";
    }
    public function dashboard(): void
    {
        requireLogin();

        $userId = currentUserId();

        require_once __DIR__ . '/../models/Game.php';
        require_once __DIR__ . '/../models/Purchase.php';

        $gameModel = new Game();
        $purchaseModel = new Purchase();

        $uploadedGames = $gameModel->findByDeveloperId($userId);
        $purchasedGames = $purchaseModel->getUserGames($userId);

        require __DIR__ . '/../../views/user/profile.php';
    }

    public function checkout(int $gameId): void
    {
        require_once __DIR__ . '/../helpers/auth.php';

        requireLogin();

        if ($gameId <= 0) {
            header("Location: {$this->basePath}/games");
            exit;
        }

        $gameModel = new Game();
        $gameData = $gameModel->findById($gameId);

        if (!$gameData || $gameData['status'] !== 'approved' || $gameData['price'] <= 0) {
            header("Location: {$this->basePath}/game/{$gameId}?error=" . urlencode("Cannot checkout. Item is invalid or free."));
            exit;
        }

        include __DIR__ . "/../../views/game/checkout.php";
    }

    public function submitReview(int $gameId): void
    {
        requireLogin();

        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            header("Location: {$this->basePath}/game/{$gameId}");
            exit;
        }

        $userId = currentUserId();
        $rating = (int)($_POST['rating'] ?? 0);
        $title = trim($_POST['title'] ?? '');
        $content = trim($_POST['content'] ?? '');

        $reviewModel = new Review();
        $error = null;

        if ($gameId <= 0 || $rating < 1 || $rating > 5 || empty($title) || empty($content)) {
            $error = "Invalid data provided. Please fill out all fields correctly.";
        } elseif ($reviewModel->hasUserReviewedGame($userId, $gameId)) {
            $error = "You have already submitted a review for this game.";
        }

        $isVerifiedOwner = false;
        $purchaseModel = new Purchase();
        if ($purchaseModel->hasPurchased($userId, $gameId)) {
            $isVerifiedOwner = true;
        }

        if (!$error) {
            $reviewId = $reviewModel->create($userId, $gameId, $rating, $title, $content, $isVerifiedOwner);

            if ($reviewId) {
                $message = "Review submitted successfully! It is now pending approval.";
                header("Location: {$this->basePath}/?message=" . urlencode($message));
                exit;
            } else {
                $error = "Failed to submit review. Please try again.";
            }
        }

        $redirectUrl = "{$this->basePath}/game/{$gameId}";
        $redirectUrl .= "?error=" . urlencode($error);

        header("Location: {$redirectUrl}");
        exit;
    }

    public function download(int $gameId): void
    {
        requireLogin();
        $userId = currentUserId();
        $basePath = $this->basePath;

        $gameModel = new Game();
        $purchaseModel = new Purchase();

        $gameData = $gameModel->findById($gameId);
        if (!$gameData) {
            header("Location: {$basePath}/games?error=Game+not+found");
            exit;
        }

        $isDeveloper = $gameData['user_id'] == $userId;
        $isPurchased = $purchaseModel->hasPurchased($userId, $gameId);

        if (!$isDeveloper && !$isPurchased) {
            header("Location: {$basePath}/game/{$gameId}?error=Purchase+required+to+download");
            exit;
        }

        $gameFilePathUrl = $gameData['file_url'];

        $relativePath = str_replace($basePath, '', $gameFilePathUrl);
        $fullPath = __DIR__ . "/../../public" . $relativePath;

        if (!file_exists($fullPath)) {
            header("Location: {$basePath}/game/{$gameId}?error=Game+file+not+found+on+server");
            exit;
        }

        header('Content-Type: application/octet-stream');
        header('Content-Disposition: attachment; filename="' . basename($fullPath) . '"');
        header('Content-Length: ' . filesize($fullPath));
        readfile($fullPath);
        exit;
    }

    public function processPayment(): void
    {
        requireLogin();

        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            header("Location: {$this->basePath}/games");
            exit;
        }

        $userId = currentUserId();
        $gameId = (int)($_POST['game_id'] ?? 0);
        $basePath = $this->basePath;
        $redirectUrl = "{$basePath}/game/checkout/{$gameId}";

        if ($gameId <= 0) {
            $error = "Invalid request. Missing or incorrect game ID.";
            header("Location: {$basePath}/games?error=" . urlencode($error));
            exit;
        }

        $gameModel = new Game();
        $purchaseModel = new Purchase();

        $gameData = $gameModel->findById($gameId);
        if (!$gameData) {
            $error = "Game not found.";
            header("Location: {$basePath}/games?error=" . urlencode($error));
            exit;
        }

        $requiredAmount = (float)($gameData['price'] ?? 0.0);

        if ($purchaseModel->hasPurchased($userId, $gameId)) {
            $message = "You have already purchased this game.";
            header("Location: {$basePath}/game/{$gameId}?message=" . urlencode($message));
            exit;
        }

        $transactionNo = 'SIM' . time();

        $success = $purchaseModel->record(
            $userId,
            $gameId,
            'bought',
            $requiredAmount,
            $transactionNo
        );

        if ($success) {
            $gameModel->incrementDownloadCount($gameId);
            $message = "Payment verified and purchase is complete! You can now download the game.";
            header("Location: {$basePath}/?message=" . urlencode($message));
            exit;
        } else {
            $error = "A system error occurred while finalizing your purchase. Please try again.";
            header("Location: {$redirectUrl}&error=" . urlencode($error));
            exit;
        }
    }

    public function index(): void
    {
        $gameModel = new Game();
        $userController = new UserController();
        $userData = $userController->getCurrentUserData();

        $games = $gameModel->findAllAproved();

        if (is_array($userData) && isset($userData['id']) && !empty($userData['id'])) {
            $games = $gameModel->findAllApprovedNotOwnedOrPurchased((int)$userData['id']);
        }

        require __DIR__ . "/../../views/game/list.php";
    }

    public function claim(int $gameId): void
    {
        requireLogin();
        $userId = currentUserId();

        if (!$gameId || !$userId) {
            header("Location: /sxumarcade/public/games?error=Invalid+request");
            exit;
        }

        $gameModel = new Game();
        $purchaseModel = new Purchase();

        $game = $gameModel->findById($gameId);

        if (!$game || $game['status'] !== 'approved' || (float)$game['price'] > 0) {
            header("Location: /sxumarcade/public/games?error=Game+cannot+be+claimed");
            exit;
        }

        if ($purchaseModel->hasPurchased($userId, $gameId)) {
            header("Location: /sxumarcade/public/games?error=You+already+own+this+game");
            exit;
        }

        $transactionNo = 'CLAIM_' . time();
        $success = $purchaseModel->record($userId, $gameId, 'claimed', 0.00, $transactionNo);

        if ($success) {
            $gameModel->incrementDownloadCount($gameId);
            header("Location: /sxumarcade/public/dashboard?message=Game+claimed+successfully");
        } else {
            header("Location: /sxumarcade/public/games?error=Could+not+claim+game");
        }
        exit;
    }

    public function library()
    {
        requireLogin();
        require_once __DIR__ . '/../models/Purchase.php';
        require_once __DIR__ . '/../models/Game.php';

        $purchaseModel = new Purchase();
        $gameModel = new Game();

        $games = [
            'purchased' => $purchaseModel->getUserGames(currentUserId()),
            'uploaded' => $gameModel->findByDeveloperId(currentUserId())
        ];

        require __DIR__ . '/../../views/library/index.php';
    }

    public function editGames()
    {
        require_once __DIR__ . '/../models/Game.php';
        $gameModel = new Game();
        $games = $gameModel->findByDeveloperId(currentUserId());

        require __DIR__ . '/../views/game/edit.php';
    }

    public function edit(int $gameId): void
    {
        requireLogin();

        $gameModel = new Game();
        $game = $gameModel->findById($gameId);

        if (!$game) {
            header("Location: {$this->basePath}/games?error=Game+not+found");
            exit;
        }

        if ($game['user_id'] != currentUserId()) {
            header("Location: {$this->basePath}/games?error=Unauthorized");
            exit;
        }

        $categoryModel = new Category();
        $categories = $categoryModel->getAll();

        require __DIR__ . "/../../views/game/edit.php";
    }
    public function update(): void
    {
        requireLogin();

        if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
            header("Location: {$this->basePath}/games");
            exit;
        }

        $gameId = (int)($_POST['game_id'] ?? 0);
        $gameModel = new Game();
        $game = $gameModel->findById($gameId);

        if (!$game) {
            header("Location: {$this->basePath}/games?error=Game+not+found");
            exit;
        }

        if ($game['user_id'] != currentUserId()) {
            header("Location: {$this->basePath}/games?error=Unauthorized");
            exit;
        }

        $title = trim($_POST['title'] ?? '');
        $description = trim($_POST['description'] ?? '');
        $shortDescription = trim($_POST['short_description'] ?? '');
        $price = floatval($_POST['price'] ?? 0);
        $version = trim($_POST['version'] ?? '1.0');

        if (empty($title) || empty($description)) {
            header("Location: {$this->basePath}/game/{$gameId}/edit?error=Title+and+description+required");
            exit;
        }

        $coverUrl = $game['cover_url'];
        $fileUrl = $game['file_url'];

        if (isset($_FILES['cover_image']) && $_FILES['cover_image']['error'] === UPLOAD_ERR_OK) {
            $newCover = $this->handleCoverUpload();
            if ($newCover) {
                $coverUrl = $newCover;
            }
        }

        if (isset($_FILES['game_file']) && $_FILES['game_file']['error'] === UPLOAD_ERR_OK) {
            $newFile = $this->handleGameFileUpload();
            if ($newFile) {
                $fileUrl = $newFile;
            }
        }

        $success = $gameModel->updateDetails(
            $gameId,
            $title,
            $description,
            $coverUrl,
            $fileUrl,
            $price,
            $version,
            $shortDescription
        );

        if ($success) {
            header("Location: {$this->basePath}/game/{$gameId}");
        } else {
            header("Location: {$this->basePath}/game/{$gameId}/edit?error=Update+failed");
        }
        exit;
    }
}
