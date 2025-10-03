    <?php
require_once __DIR__ . '/../app/controllers/UserController.php';

$controller = new UserController();

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $controller->signup();
} else {
    $controller->showSignupForm();
}
