<?php
require_once __DIR__ . '/../app/controllers/GameController.php';
require_once __DIR__ . '/../app/helpers/auth.php';

$controller = new GameController();
$controller->viewGame();