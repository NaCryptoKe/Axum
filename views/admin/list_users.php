<?php
// views/admin/list_users.php
// Expects $users (array) and $pageTitle
$pageTitle = $pageTitle ?? 'Manage Users';
ob_start();
?>
<h2>👥 <?= htmlspecialchars($pageTitle) ?></h2>
<p class="muted subtitle">Manage users: promote/demote or delete accounts.</p>

<table>
    <thead>
        <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            <th>Created</th>
            <th>Actions</th>
        </tr>
    </thead>
    <tbody>
        <?php if (empty($users)): ?>
            <tr><td colspan="7" class="muted">No users found.</td></tr>
        <?php else: ?>
            <?php foreach ($users as $u): ?>
                <tr>
                    <td><?= (int)$u['id'] ?></td>
                    <td><?= htmlspecialchars($u['username']) ?></td>
                    <td><?= htmlspecialchars($u['email']) ?></td>
                    <td><?= (!empty($u['is_admin']) ? 'Admin' : 'User') ?></td>
                    <td><?= htmlspecialchars($u['created_at'] ?? '') ?></td>
                    <td class="actions">
                        <?php if (empty($u['is_admin'])): ?>
                            <form method="POST">
                                <input type="hidden" name="user_id" value="<?= (int)$u['id'] ?>">
                                <input type="hidden" name="action" value="promote">
                                <button class="btn btn-promote" type="submit">Promote</button>
                            </form>
                        <?php else: ?>
                            <form method="POST">
                                <input type="hidden" name="user_id" value="<?= (int)$u['id'] ?>">
                                <input type="hidden" name="action" value="demote">
                                <button class="btn btn-demote" type="submit">Demote</button>
                            </form>
                        <?php endif; ?>

                        <form method="POST" onsubmit="return confirm('Delete user permanently?');">
                            <input type="hidden" name="user_id" value="<?= (int)$u['id'] ?>">
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
$adminContent = ob_get_clean();
require __DIR__ . "/admin_layout.php";