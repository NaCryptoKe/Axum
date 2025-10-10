<?php
$basePath = '/sxumarcade/public';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Edit Game - AxumArcade</title>
    <link rel="stylesheet" href="<?= $basePath ?>/assets/css/theme.css">
    <link rel="stylesheet" href="<?= $basePath ?>/assets/css/layout.css">
    <link rel="stylesheet" href="<?= $basePath ?>/assets/css/reset.css">
    <link rel="stylesheet" href="<?= $basePath ?>/assets/css/upload.css">
    <link rel="stylesheet" href="<?= $basePath ?>/assets/css/edit-game.css">
    <link rel="icon" type="image/svg+xml" href="<?= $basePath ?>/assets/img/LOGO.svg">
</head>
<body>
    <?php 
        $userController = new UserController();
        $userController->header();
    ?>
    
    <main>
        <?php include __DIR__ . '/../layout/side-bar.php'; ?>
        
        <div class="content">
            <div class="form-container">
                <h1>Edit Game</h1>
                <p class="form-subtitle">Update your game details for the AxumArcade community</p>

                <form action="<?= $basePath ?>/game/edit/<?= $game['id'] ?>" method="POST" enctype="multipart/form-data" class="game-form">
                    <input type="hidden" name="game_id" value="<?= $game['id'] ?>">

                    <div class="form-section">
                        <h3>📝 Basic Information</h3>
                        <div class="form-group">
                            <label for="title">Game Title *</label>
                            <input type="text" name="title" id="title" required class="form-input" 
                                   value="<?= htmlspecialchars($game['title'] ?? '') ?>">
                        </div>
                        <div class="form-group">
                            <label for="short_description">Short Description</label>
                            <textarea name="short_description" id="short_description" rows="2" class="form-textarea"><?= htmlspecialchars($game['short_description'] ?? '') ?></textarea>
                            <small>This appears in game listings and search results</small>
                        </div>
                        <div class="form-group">
                            <label for="description">Full Description *</label>
                            <textarea name="description" id="description" rows="6" required class="form-textarea"><?= htmlspecialchars($game['description'] ?? '') ?></textarea>
                            <small>Describe your game in detail...</small>
                        </div>
                        <div class="form-group">
                            <label for="version">Version</label>
                            <input type="text" name="version" id="version" value="<?= htmlspecialchars($game['version'] ?? '1.0') ?>" class="form-input">
                        </div>
                    </div>

                    <div class="form-section">
                        <h3>📁 Game Files</h3>
                        <div class="form-group">
                            <label for="cover_image">Cover Image</label>
                            <div class="file-upload-area" id="coverUploadArea">
                                <input type="file" name="cover_image" id="cover_image" accept="image/*" class="file-input-hidden">
                                <div class="upload-placeholder">
                                    <div class="upload-icon">🖼️</div>
                                    <p>Click to change cover image</p>
                                    <small>PNG, JPG, GIF up to 5MB • Recommended: 1280x720px</small>
                                </div>
                                <div class="file-preview" id="coverPreview">
                                    <?php if (!empty($game['cover_url'])): ?>
                                        <img src="<?= htmlspecialchars($game['cover_url']) ?>" alt="Cover preview">
                                    <?php endif; ?>
                                </div>
                            </div>
                        </div>

                        <div class="form-group">
                            <label for="game_file">Game File</label>
                            <div class="file-upload-area" id="gameUploadArea">
                                <input type="file" name="game_file" id="game_file" class="file-input-hidden" accept=".zip,.rar,.7z,.exe,.apk,.ipa">
                                <div class="upload-placeholder">
                                    <div class="upload-icon">🎮</div>
                                    <p>Click to upload new game file</p>
                                    <small>ZIP, RAR, EXE, APK up to 100MB</small>
                                </div>
                                <div class="file-preview" id="gamePreview">
                                    <?php if (!empty($game['file_url'])): ?>
                                        <div class="file-info">
                                            <div class="file-icon">📦</div>
                                            <div class="file-details">
                                                <div class="file-name"><?= basename($game['file_url']) ?></div>
                                            </div>
                                        </div>
                                    <?php endif; ?>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div class="form-section">
                        <h3>💰 Pricing</h3>
                        <div class="form-group">
                            <label for="price">Price (ETB)</label>
                            <input type="number" name="price" id="price" min="0" step="0.01" value="<?= htmlspecialchars($game['price'] ?? '0') ?>" class="form-input" style="max-width: 200px;">
                            <small>Set to 0 for free games</small>
                        </div>
                    </div>

                    <div class="form-actions">
                        <a href="<?= $basePath ?>/games" class="btn-secondary">Cancel</a>
                        <button type="submit" class="btn-primary btn-large">💾 Update Game</button>
                    </div>
                </form>
            </div>
        </div>
    </main>

    <script>
        document.addEventListener('DOMContentLoaded', function() {
            const coverInput = document.getElementById('cover_image');
            const coverPreview = document.getElementById('coverPreview');
            const coverUploadArea = document.getElementById('coverUploadArea');

            coverInput.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        coverPreview.innerHTML = `
                            <img src="${e.target.result}" alt="Cover preview">
                            <button type="button" class="remove-file" onclick="clearFile('cover_image')">×</button>
                        `;
                        coverUploadArea.classList.add('has-file');
                    };
                    reader.readAsDataURL(file);
                }
            });

            const gameInput = document.getElementById('game_file');
            const gamePreview = document.getElementById('gamePreview');
            const gameUploadArea = document.getElementById('gameUploadArea');

            gameInput.addEventListener('change', function(e) {
                const file = e.target.files[0];
                if (file) {
                    const fileSize = (file.size / (1024 * 1024)).toFixed(2);
                    gamePreview.innerHTML = `
                        <div class="file-info">
                            <div class="file-icon">📦</div>
                            <div class="file-details">
                                <div class="file-name">${file.name}</div>
                                <div class="file-size">${fileSize} MB</div>
                            </div>
                            <button type="button" class="remove-file" onclick="clearFile('game_file')">×</button>
                        </div>
                    `;
                    gameUploadArea.classList.add('has-file');
                }
            });
        });

        function clearFile(inputId) {
            const input = document.getElementById(inputId);
            const preview = document.getElementById(inputId + 'Preview');
            const uploadArea = document.getElementById(inputId + 'UploadArea');

            input.value = '';
            preview.innerHTML = '';
            uploadArea.classList.remove('has-file');
        }
    </script>
</body>
</html>
