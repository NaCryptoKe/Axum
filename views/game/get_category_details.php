<h1>Category detail</h1>

<?php if (empty($category)): ?>
    <p>Category not found.</p>
<?php else: ?>
    <h2><?php echo htmlspecialchars($category['name']); ?></h2>
    <p><?php echo nl2br(htmlspecialchars($category['description'] ?? 'No description available.')); ?></p>
<?php endif; ?>

<!-- get_categrory_details.php -->