const db = require('../config/db');
const bcrypt = require('bcrypt');

// =========================== CRUD OPERATIONS ===============================

/**
 * Fetch all active (non-deleted) users.
 *
 * @description
 * Retrieves all user records from the database that have not been soft deleted.
 * Sorted by creation date in descending order.
 *
 * @returns {Promise<Array<Object>>} A promise that resolves to an array of user objects.
 *
 * @example
 * const users = await getAllUsers();
 * console.log(users);
 */
exports.getAllUsers = async () => {
  const result = await db.query(`
    SELECT id, username, email, display_name, avatar_url, bio, role, created_at, updated_at
    FROM core.users
    WHERE is_deleted = false
    ORDER BY created_at DESC
  `);
  return result.rows;
};

/**
 * Fetch a single user by ID (excluding deleted ones).
 *
 * @description
 * Looks up a user record by UUID, ensuring it hasn't been soft deleted.
 *
 * @param {string} id - UUID of the user to retrieve.
 * @returns {Promise<Object|null>} A promise that resolves to the user object or null if not found.
 *
 * @example
 * const user = await getUserById('1b2c3d4e...');
 */
exports.getUserById = async (id) => {
  const result = await db.query(`
    SELECT id, username, email, display_name, avatar_url, bio, role, created_at, updated_at
    FROM core.users
    WHERE id = $1 AND is_deleted = false
  `, [id]);
  return result.rows[0];
};

/**
 * Fetch a user by username or email (excluding deleted ones).
 *
 * @description
 * Retrieves a user record matching the provided username or email.
 * Commonly used for login or account recovery.
 *
 * @param {string} identifier - Username or email of the user.
 * @returns {Promise<Object|null>} A promise that resolves to the user object or null if not found.
 *
 * @example
 * const user = await getUserByIdentifier('nahom@example.com');
 */
exports.getUserByIdentifier = async (identifier) => {
  const result = await db.query(`
    SELECT * FROM core.users
    WHERE (username = $1 OR email = $1) AND is_deleted = false
  `, [identifier]);
  return result.rows[0];
};

/**
 * Create a new user record.
 *
 * @description
 * Inserts a new user into the `core.users` table after hashing their password.
 * If no role is specified, defaults to 'player' (handled by the database).
 * Only roles defined in the `core.user_role` enum are allowed:
 * 'player', 'creator', 'moderator', 'admin'.
 *
 * @param {Object} params - The new user data.
 * @param {string} params.username - Unique username (3–30 alphanumeric/underscore characters).
 * @param {string} params.email - Valid email address.
 * @param {string} params.display_name - Display name of the user.
 * @param {string} params.password - Plain-text password to be hashed before insertion.
 * @param {string} [params.avatar_url] - Optional avatar image URL.
 * @param {string} [params.bio] - Optional biography text or user description.
 *
 * @returns {Promise<Object>} A promise that resolves to the newly created user record.
 *
 * @throws {Error} Throws an error if any field violates unique constraints, validation checks,
 * or if the provided data is invalid.
 *
 * @example
 * const newUser = await createUser({
 *   username: 'nahom',
 *   email: 'nahom@example.com',
 *   display_name: 'Nahom',
 *   password: 'supersecurepassword',
 *   avatar_url: '/avatars/nahom.png',
 *   bio: 'I make games.'
 * });
 */
exports.createUser = async ({ username, email, display_name, password, avatar_url, bio }) => {
  const hashedPassword = await bcrypt.hash(password, 10);

  const result = await db.query(`
    INSERT INTO core.users (
      username,
      email,
      display_name,
      hashed_password,
      avatar_url,
      bio
    )
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING id, username, email, display_name, avatar_url, bio, role, created_at
  `, [username, email, display_name, hashedPassword, avatar_url, bio]);

  return result.rows[0];
};

/**
 * Update an existing user's profile information.
 *
 * @description
 * Safely updates non-sensitive user fields (username, email, display name, etc.)
 * while preventing self-promotion of roles. Skips updates for deleted users.
 * 
 * Regular users can update their profile info (username, email, avatar, bio, etc.)
 * but *not* their `role` unless explicitly allowed by higher privileges (handled in app logic).
 *
 * @param {string} id - UUID of the user to update.
 * @param {Object} updates - Object containing the fields to update.
 * @param {string} [updates.username] - New username (must be unique).
 * @param {string} [updates.email] - New email (must be unique).
 * @param {string} [updates.display_name] - New display name.
 * @param {string} [updates.avatar_url] - New avatar image URL.
 * @param {string} [updates.bio] - New biography text.
 * @returns {Promise<Object|null>} A promise that resolves to the updated user record or null if not found.
 *
 * @throws {Error} Throws if a unique constraint or validation check is violated.
 *
 * @example
 * const updatedUser = await updateUser('1b2c3d4e...', {
 *   bio: 'Making games and chaos.',
 *   display_name: 'Nahom K.'
 * });
 */
exports.updateUser = async (id, updates) => {
  const { username, email, display_name, avatar_url, bio } = updates;

  const result = await db.query(`
    UPDATE core.users
    SET 
      username = COALESCE($1, username),
      email = COALESCE($2, email),
      display_name = COALESCE($3, display_name),
      avatar_url = COALESCE($4, avatar_url),
      bio = COALESCE($5, bio),
      updated_at = now()
    WHERE id = $6 AND is_deleted = false
    RETURNING id, username, email, display_name, avatar_url, bio, role, updated_at
  `, [username, email, display_name, avatar_url, bio, id]);

  return result.rows[0] || null;
};

/**
 * Update a user's password.
 *
 * @description
 * Replaces the user's hashed password with a new one.
 * The password is hashed using bcrypt before being stored.
 *
 * @param {string} id - UUID of the user.
 * @param {string} newPassword - The new plain-text password.
 * @returns {Promise<Object|null>} A promise that resolves to the user’s basic info or null if not found.
 *
 * @example
 * const user = await updatePassword('1b2c3d4e...', 'newSuperSecretPass');
 */
exports.updatePassword = async (id, newPassword) => {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  const result = await db.query(`
    UPDATE core.users
    SET hashed_password = $1, updated_at = now()
    WHERE id = $2 AND is_deleted = false
    RETURNING id, username, email, updated_at
  `, [hashedPassword, id]);
  return result.rows[0];
};

/**
 * Soft delete a user (mark as deleted without removing from database).
 *
 * @description
 * Flags the user record as deleted and sets the deletion timestamp.
 * Useful for reversible deletions or audit logging.
 *
 * @param {string} id - UUID of the user to soft delete.
 * @returns {Promise<Object|null>} A promise that resolves to the soft-deleted user info or null if not found.
 *
 * @example
 * const deleted = await softDeleteUser('1b2c3d4e...');
 */
exports.softDeleteUser = async (id) => {
  const result = await db.query(`
    UPDATE core.users
    SET is_deleted = true, deleted_at = now(), updated_at = now()
    WHERE id = $1 AND is_deleted = false
    RETURNING id, username, email, deleted_at
  `, [id]);
  return result.rows[0];
};

/**
 * Permanently delete a user from the database.
 *
 * @description
 * Irreversibly removes a user record. Use with caution.
 *
 * @param {string} id - UUID of the user to permanently delete.
 * @returns {Promise<Object|null>} A promise that resolves to the deleted user’s basic info or null if not found.
 *
 * @example
 * const removed = await hardDeleteUser('1b2c3d4e...');
 */
exports.hardDeleteUser = async (id) => {
  const result = await db.query(`
    DELETE FROM core.users
    WHERE id = $1
    RETURNING id, username, email
  `, [id]);
  return result.rows[0];
};
