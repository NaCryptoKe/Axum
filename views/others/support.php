<?php
$basePath = $basePath ?? '/sxumarcade/public';
$isOwnProfile = $isOwnProfile ?? false;

$chatHandlerRelativePath = '/api/chat_handler.php';
$chatHandlerUrl = rtrim($basePath, '/') . $chatHandlerRelativePath;
?>
<?php
$basePath = '/sxumarcade/public';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AxumArcade Support</title>
    <link rel="icon" type="image/png" href="<?= $basePath ?>/assets/img/LOGO.svg">
    <link rel="stylesheet" href="<?= $basePath ?>/assets/css/theme.css">
    <link rel="stylesheet" href="<?= $basePath ?>/assets/css/reset.css">
    <link rel="stylesheet" href="<?= $basePath ?>/assets/css/layout.css">
    <link rel="stylesheet" href="<?= $basePath ?>/assets/css/chat.css">
  <link rel="stylesheet" href="<?= $basePath ?>/assets/css/cards.css">
</head>
<body data-chat-handler-url="<?= htmlspecialchars($chatHandlerUrl) ?>"> 
    <?php include __DIR__ . "/../layout/header.php"; ?>
    <main>
        <?php include '../views/layout/side-bar.php'; ?>

        <div class="content">
            <div class="chat-widget">
                <div class="chat-history" id="chat-history"></div>
                <div class="chat-input-area">
                    <input type="text" id="chat-input" class="chat-input" placeholder="Ask Axum Arcade AI a question...">
                    <button id="send-button" class="send-button">Send</button>
                </div>
            </div>
        </div>
    </main>

    <script src="<?= $basePath ?>/assets/js/chat-logic.js"></script>
</body>
</html>