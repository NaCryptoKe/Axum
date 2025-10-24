const db = require('../config/db');

/**
 * ===============================================
 * ORDER MODEL — User purchases
 * ===============================================
 */

/**
 * Create a new order.
 *
 * @param {Object} params
 * @param {string} params.user_id - UUID of the purchasing user.
 * @param {string} params.status - Order status ('pending', 'completed', etc.).
 * @param {number} params.total_amount - Total amount.
 * @param {string} params.currency - Currency code (e.g., 'USD').
 * @param {string} [params.provider_txn_id] - Optional external provider transaction ID.
 * @returns {Promise<Object>} Newly created order record.
 */
exports.createOrder = async ({ user_id, status, total_amount, currency, provider_txn_id }) => {
  const result = await db.query(`
    INSERT INTO financials.orders (user_id, status, total_amount, currency, provider_txn_id)
    VALUES ($1,$2,$3,$4,$5)
    RETURNING *
  `, [user_id, status, total_amount, currency, provider_txn_id]);
  return result.rows[0];
};
