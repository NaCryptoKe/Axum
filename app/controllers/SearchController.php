<?php
// Controller for handling search functionality for games and users.
require_once __DIR__ . '/../models/Game.php';
require_once __DIR__ . '/../models/User.php';

class SearchController
{
    private $basePath = '/sxumarcade/public/';

    public function index()
    {
        $query = trim($_GET['q'] ?? '');
        $gameResults = [];
        $userResults = [];

        if ($query !== '') {
            $gameModel = new Game();
            $userModel = new User();

            $gameResults = $gameModel->searchByTitle($query);
            $userResults = $userModel->searchByUsername($query);
        }

        $games = $gameResults;
        $users = $userResults;

        require __DIR__ . "/../../views/others/results.php";
    }
}
