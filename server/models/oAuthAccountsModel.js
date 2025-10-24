const db = require('../config/db');

/**
 * ===============================================
 *  OAUTH ACCOUNT MODEL — External provider linking
 * ===============================================
 *
 * Represents external authentication accounts (Google, GitHub, Discord, etc.)
 * linked to users in the `core.users` table.
 *
 * Each record maps:
 * - `provider`: e.g., 'google', 'github', 'discord'
 * - `provider_account_id`: unique ID from that provider
 * - `user_id`: internal Axum Arcade user
 *
 * The composite PRIMARY KEY (provider, provider_account_id)
 * ensures a provider ID can’t be linked twice.
 * Deleting a user cascades and removes their OAuth accounts.
 */


// =========================== CRUD OPERATIONS ===============================

/**
 * Link an external OAuth account to a user.
 *
 * @description
 * Inserts a new OAuth connection record. Used after successful
 * external authentication to associate the provider account with
 * an internal user.
 *
 * @param {Object} params - OAuth account data.
 * @param {string} params.provider - OAuth provider name (e.g., 'google', 'github').
 * @param {string} params.provider_account_id - The unique user ID from the provider.
 * @param {string} params.user_id - The internal UUID of the user in `core.users`.
 *
 * @returns {Promise<Object>} A promise that resolves to the created record.
 *
 * @throws {Error} If the account already exists (duplicate provider + account ID).
 *
 * @example
 * const account = await linkOAuthAccount({
 *   provider: 'google',
 *   provider_account_id: '1083294738927398',
 *   user_id: 'b4f9c8d2-1234-45ef-9d87-2f08bda8fa2a'
 * });
 */
exports.linkOAuthAccount = async ({ provider, provider_account_id, user_id }) => {
  const result = await db.query(`
    INSERT INTO core.oauth_accounts (provider, provider_account_id, user_id)
    VALUES ($1, $2, $3)
    RETURNING provider, provider_account_id, user_id
  `, [provider, provider_account_id, user_id]);

  return result.rows[0];
};


/**
 * Retrieve an OAuth account by provider + account ID.
 *
 * @param {string} provider - OAuth provider name.
 * @param {string} provider_account_id - The unique ID from the provider.
 * @returns {Promise<Object|null>} The matching OAuth record or null.
 *
 * @example
 * const account = await getOAuthAccount('github', '83920183');
 */
exports.getOAuthAccount = async (provider, provider_account_id) => {
  const result = await db.query(`
    SELECT provider, provider_account_id, user_id
    FROM core.oauth_accounts
    WHERE provider = $1 AND provider_account_id = $2
  `, [provider, provider_account_id]);

  return result.rows[0];
};


/**
 * Get all OAuth accounts linked to a specific user.
 *
 * @param {string} user_id - UUID of the user.
 * @returns {Promise<Array<Object>>} List of linked OAuth providers.
 *
 * @example
 * const accounts = await getUserOAuthAccounts('b4f9c8d2-...');
 */
exports.getUserOAuthAccounts = async (user_id) => {
  const result = await db.query(`
    SELECT provider, provider_account_id
    FROM core.oauth_accounts
    WHERE user_id = $1
  `, [user_id]);

  return result.rows;
};


/**
 * Unlink an OAuth account from a user.
 *
 * @param {string} provider - OAuth provider name.
 * @param {string} provider_account_id - Unique ID from the provider.
 * @returns {Promise<Object|null>} The deleted record, or null if not found.
 *
 * @example
 * const removed = await unlinkOAuthAccount('google', '1083294738927398');
 */
exports.unlinkOAuthAccount = async (provider, provider_account_id) => {
  const result = await db.query(`
    DELETE FROM core.oauth_accounts
    WHERE provider = $1 AND provider_account_id = $2
    RETURNING provider, provider_account_id, user_id
  `, [provider, provider_account_id]);

  return result.rows[0];
};
