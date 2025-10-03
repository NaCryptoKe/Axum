<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Upload Game</title>
</head>
<body>
    <h1>Upload New Game</h1>

    <?php if (!empty($errorMessage)): ?>
        <p style="color:red;"><?= htmlspecialchars($errorMessage) ?></p>
    <?php endif; ?>

    <form action="./create.php" method="POST" enctype="multipart/form-data">
        <div>
            <label for="title">Game Title:</label>
            <input type="text" id="title" name="title" required>
        </div>
        <div>
            <label for="description">Description:</label>
            <textarea id="description" name="description" required></textarea>
        </div>
        <div>
            <label for="short_description">Short Description (optional):</label>
            <textarea id="short_description" name="short_description"></textarea>
        </div>
        <div>
            <label for="price">Price (USD):</label>
            <input type="number" id="price" name="price" step="0.01" value="0.00" required>
        </div>
        <div>
            <label for="version">Version:</label>
            <input type="text" id="version" name="version" required>
        </div>
        <div>
            <label for="cover_image">Cover Image:</label>
            <input type="file" id="cover_image" name="cover_image" accept="image/*">
        </div>
        <div>
            <label for="game_file">Game File:</label>
            <input type="file" id="game_file" name="game_file" accept=".zip,.rar,.7z,.exe,.apk">
        </div>
        <div>
            <?php
                require_once __DIR__ . '/../../app/controllers/CategoryController.php';

                $controller = new CategoryController();
                $controller->listCategories();
            ?>
        </div>
        <h2>Game Media</h2>

        <div>
            <label for="screenshots">Upload Screenshots:</label>
            <input type="file" id="screenshots" name="screenshots[]" accept="image/*" multiple>
        </div>

        <div>
            <label for="videos">Upload Videos:</label>
            <input type="file" id="videos" name="videos[]" accept="video/*" multiple>
        </div>

        <div>
            <label for="youtube_links">YouTube Links (one per line):</label>
            <textarea id="youtube_links" name="youtube_links" rows="3" placeholder="https://youtube.com/..."></textarea>
        </div>
        <div>
            <button type="submit">Upload Game</button>
        </div>
    </form>
</body>
</html>