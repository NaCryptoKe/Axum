<?php
// views/admin/list_games.php
// Expects $games (array) and $pageTitle
$pageTitle = $pageTitle ?? 'Manage Games';
ob_start();
?>
<h2>🎮 <?= htmlspecialchars($pageTitle) ?></h2>
<p class="muted subtitle">Approve, reject, or delete games uploaded by developers.</p>

<table>
    <thead>
        <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Developer</th>
            <th>Price</th>
            <th>Downloads</th>
            <th>Rating</th>
            <th>Approved</th>
            <th>Actions</th>
        </tr>
    </thead>
    <tbody>
        <?php if (empty($games)): ?>
            <tr><td colspan="8" class="muted">No games found.</td></tr>
        <?php else: ?>
            <?php foreach ($games as $g): ?>
                <tr>
                    <td><?= (int)$g['id'] ?></td>
                    <td><?= htmlspecialchars($g['title']) ?></td>
                    <td><?= htmlspecialchars($g['developer_username'] ?? '—') ?></td>
                    <td><?= number_format((float)($g['price'] ?? 0), 2) ?></td>
                    <td><?= (int)($g['download_count'] ?? 0) ?></td>
                    <td><?= number_format((float)($g['average_rating'] ?? 0), 2) ?></td>
                    <td>
    <?php 
        if ($g['status'] === 'approved') echo 'Yes';
        elseif ($g['status'] === 'pending') echo 'Pending';
        else echo 'No';
    ?>
    </td>
    <td class="actions">
        <?php if ($g['status'] !== 'approved'): ?>
        <form method="POST" style="display:inline">
            <input type="hidden" name="game_id" value="<?= (int)$g['id'] ?>">
            <input type="hidden" name="action" value="approve">
            <button class="btn btn-approve" type="submit">Approve</button>
        </form>

        <form method="POST" style="display:inline">
            <input type="hidden" name="game_id" value="<?= (int)$g['id'] ?>">
            <input type="hidden" name="action" value="reject">
            <input type="text" name="rejection_reason" placeholder="Reason for rejection" required>
            <button class="btn btn-reject" type="submit">Reject</button>
        </form>
    <?php else: ?>
        <form method="POST" style="display:inline">
            <input type="hidden" name="game_id" value="<?= (int)$g['id'] ?>">
            <input type="hidden" name="action" value="reject">
            <input type="text" name="rejection_reason" placeholder="Reason for rejection" required>
            <button class="btn btn-reject" type="submit">Un-approve</button>
        </form>
    <?php endif; ?>

    <form method="POST" onsubmit="return confirm('Delete game permanently?');">
        <input type="hidden" name="game_id" value="<?= (int)$g['id'] ?>">
        <input type="hidden" name="action" value="delete">
        <button class="btn btn-delete" type="submit">Delete</button>
    </form>
</td>

                </tr>
            <?php endforeach; ?>
        <?php endif; ?>
    </tbody>
</table>

<?php
// Capture the output and store it in a variable
$adminContent = ob_get_clean();
require __DIR__ . "/admin_layout.php";