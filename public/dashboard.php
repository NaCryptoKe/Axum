<?php
require_once __DIR__ . '/../app/controllers/UserController.php';
require_once __DIR__ . '/../app/helpers/auth.php';

$controller = new UserController();
$controller->dashboard();