<?php
require_once __DIR__ . '/../models/Game.php';
require_once __DIR__ . '/../models/GameCategory.php';
require_once __DIR__ . '/../helpers/file.php';
require_once __DIR__ . '/../helpers/auth.php';

class GameController
{
    public function listApprovedGames(): void
    {
        $gameModel = new Game();
        $games = $gameModel->findAllAproved();
        require __DIR__ . "/../../views/game/list.php";
    }

    public function viewGame(): void
    {
        $gameId = isset($_GET['id']) ? (int) $_GET['id'] : 0;

        $gameModel = new Game();
        $game = $gameModel->findById($gameId);
        if ($game) {
            require __DIR__ . "/../../views/game/view_game.php";
        } else {
            http_response_code(404);
            echo "Game not found.";
        }
    }

    public function listDeveloperGames(int $devId): void
    {
        $gameModel = new Game();
        $games = $gameModel->findByDeveloperId($devId);
        require __DIR__ . "/../../views/game/developer_games.php";
    }

    public function showCreateForm(?string $error = null): void
    {
        // Pass error variable to view
        $errorMessage = $error;
        require __DIR__ . "/../../views/game/create.php";
    }

    public function uploadGame() : void
    {
        if ($_SERVER['REQUEST_METHOD'] === 'POST') {
            $userId = currentUserId();
            if (!$userId) {
                header("Location: login.php");
                exit;
            }

            $title = trim($_POST['title'] ?? '');
            $description = trim($_POST['description'] ?? '');
            $shortDescription = $_POST['short_description'] ?? null;
            $price = isset($_POST['price']) ? (float)$_POST['price'] : 0.00;
            $version = $_POST['version'] ?? '';

            // ✅ Make title & description required
            if (empty($title) || empty($description)) {
                $this->showCreateForm("❌ Title and Description are required.");
                return;
            }

            // Handle file uploads (optional now)
            $coverUrl = handleFileUpload('cover_image', 'covers');
            $fileUrl  = handleFileUpload('game_file', 'games');

            if ($coverUrl === false) {
                $this->showCreateForm("❌ Failed to upload cover image.");
                return;
            }
            if ($fileUrl === false) {
                $this->showCreateForm("❌ Failed to upload cover image.");
                return;
            }

            if ($coverUrl !== '') {
                $coverUrl = '.' . $coverUrl; // Making relative path
            }
            if ($fileUrl !== '') {
                $fileUrl = '.' . $fileUrl; // Making relative path
            }

            $gameModel = new Game();
            $gameId = $gameModel->create(
                $userId, 
                $title, 
                $description, 
                $coverUrl,      // can be null
                $fileUrl,       // can be null
                $price, 
                $version,
                $shortDescription
            );

            $gameCategory = new GameCategory();
            $pickedCategories = explode(',', $_POST['picked_categories'] ?? '');
            foreach($pickedCategories as $catId) {
                $catId = (int) trim($catId);
                if ($catId > 0) {
                    $gameCategory->assign($gameId, $catId);
                }
            }

            if ($gameId) {
        $gameMedia = new GameMedia();

        // Screenshots
        if (!empty($_FILES['screenshots']['name'][0])) {
            foreach ($_FILES['screenshots']['tmp_name'] as $index => $tmpName) {
                $fileUrl = handleFileUploadMultiple('screenshots', $index, 'screenshots');
                if ($fileUrl) {
                    $gameMedia->create($gameId, $fileUrl, 'screenshot');
                }
            }
        }

        // Videos
        if (!empty($_FILES['videos']['name'][0])) {
            foreach ($_FILES['videos']['tmp_name'] as $index => $tmpName) {
                $fileUrl = handleFileUploadMultiple('videos', $index, 'videos');
                if ($fileUrl) {
                    $gameMedia->create($gameId, $fileUrl, 'video');
                }
            }
        }

        // YouTube links
        if (!empty(trim($_POST['youtube_links']))) {
            $youtubeLinks = explode("\n", trim($_POST['youtube_links']));
            foreach ($youtubeLinks as $link) {
                $link = trim($link);
                if (!empty($link)) {
                    $gameMedia->create($gameId, $link, 'youtube');
                }
            }
        }
    }


            if ($gameId) {
                header("Location: view_game.php?id=" . $gameId);
                exit;
            } else {
                $this->showCreateForm("❌ Failed to create game entry.");
            }
        }
    }

}
