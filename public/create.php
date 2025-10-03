<?php
require_once __DIR__ . '/../app/controllers/GameController.php';

$controller = new GameController();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $controller->uploadGame();
} else {
    $controller->showCreateForm();
}