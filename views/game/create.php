<?php
$basePath = '/sxumarcade/public';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Upload Game - AxumArcade</title>
    <link rel="stylesheet" href="<?= $basePath ?>/assets/css/theme.css">
    <link rel="stylesheet" href="<?= $basePath ?>/assets/css/layout.css">
    <link rel="stylesheet" href="<?= $basePath ?>/assets/css/reset.css">
    <link rel="stylesheet" href="<?= $basePath ?>/assets/css/upload.css">
    <link rel="stylesheet" href="<?= $basePath ?>/assets/css/cards.css">
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
                <h1>Upload Your Game</h1>
                <p class="form-subtitle">Share your creation with the AxumArcade community</p>
                
                <?php if (isset($errorMessage)): ?>
                    <div class="error-message">
                        <strong>Error:</strong> <?= htmlspecialchars($errorMessage) ?>
                    </div>
                <?php endif; ?>

                <!-- FIX: Changed form action to point to the correct 'store' route -->
                <form action="<?= $basePath ?>/game/store" method="POST" enctype="multipart/form-data" class="game-form">
                    <div class="form-section">
                        <h3>📝 Basic Information</h3>
                        
                        <div class="form-group">
                            <label for="title">Game Title *</label>
                            <input type="text" name="title" id="title" required class="form-input" 
                                   placeholder="Enter your game's title" value="<?= htmlspecialchars($_POST['title'] ?? '') ?>">
                        </div>
                        
                        <div class="form-group">
                            <label for="short_description">Short Description</label>
                            <textarea name="short_description" id="short_description" rows="2" class="form-textarea" 
                                      placeholder="A brief description shown in game listings (max 255 characters)"><?= htmlspecialchars($_POST['short_description'] ?? '') ?></textarea>
                            <small>This appears in game listings and search results</small>
                        </div>
                        
                        <div class="form-group">
                            <label for="description">Full Description *</label>
                            <textarea name="description" id="description" rows="6" required class="form-textarea"
                                      placeholder="Describe your game in detail... What makes it special?"><?= htmlspecialchars($_POST['description'] ?? '') ?></textarea>
                            <small>Tell players about your game's features, gameplay, and story</small>
                        </div>
                    </div>

                    <div class="form-section">
                        <h3>📁 Game Files</h3>
                        
                        <div class="form-group">
                            <label for="cover_image">Cover Image *</label>
                            <div class="file-upload-area" id="coverUploadArea">
                                <input type="file" name="cover_image" id="cover_image" accept="image/*" required 
                                       class="file-input-hidden">
                                <div class="upload-placeholder">
                                    <div class="upload-icon">🖼️</div>
                                    <p>Click to upload cover image</p>
                                    <small>PNG, JPG, GIF up to 5MB • Recommended: 1280x720px</small>
                                </div>
                                <div class="file-preview" id="coverPreview"></div>
                            </div>
                        </div>
                        
                        <div class="form-group">
                            <label for="game_file">Game File *</label>
                            <div class="file-upload-area" id="gameUploadArea">
                                <input type="file" name="game_file" id="game_file" required 
                                       class="file-input-hidden" accept=".zip,.rar,.7z,.exe,.apk,.ipa">
                                <div class="upload-placeholder">
                                    <div class="upload-icon">🎮</div>
                                    <p>Click to upload game file</p>
                                    <small>ZIP, RAR, 7Z, EXE, APK, IPA up to 100MB</small>
                                </div>
                                <div class="file-preview" id="gamePreview"></div>
                            </div>
                        </div>
                    </div>

                    <div class="form-section">
                        <h3>💰 Pricing & Categories</h3>
                        
                        <div class="form-group">
                            <label for="price">Price ($ USD)</label>
                            <input type="number" name="price" id="price" min="0" step="0.01" value="<?= htmlspecialchars($_POST['price'] ?? '0') ?>" 
                                   class="form-input" style="max-width: 200px;">
                            <small>Set to 0 for free games. You'll receive 70% of sales revenue.</small>
                        </div>
                        
                        <div class="form-group">
                            <label>Categories (select up to 3)</label>
                            <div class="categories-grid">
                                <?php foreach ($categories as $category): ?>
                                    <label class="category-checkbox">
                                        <input type="checkbox" name="categories[]" value="<?= $category['id'] ?>"
                                            <?= (in_array($category['id'], $_POST['categories'] ?? [])) ? 'checked' : '' ?>>
                                        <span class="checkmark"></span>
                                        <span class="category-name"><?= htmlspecialchars($category['name']) ?></span>
                                    </label>
                                <?php endforeach; ?>
                            </div>
                        </div>
                    </div>

                    <div class="form-actions">
                        <a href="<?= $basePath ?>/games" class="btn-secondary">Cancel</a>
                        <button type="submit" class="btn-primary btn-large">🚀 Upload Game</button>
                    </div>
                </form>
            </div>
        </div>
    </main>

    <script src="<?= $basePath ?>/assets/js/upload.js"></script>
</body>
</html>
