const db = require('../config/db');

/**
 * ===============================================
 * ORDER ITEM MODEL — Individual items within an order
 * ===============================================
 */

/**
 * Add an item to an order.
 *
 * @param {Object} params
 * @param {string} params.order_id - UUID of the order.
 * @param {string} params.game_id - UUID of the game being purchased.
 * @param {number} params.amount - Amount for the item.
 * @param {string} params.currency - Currency code.
 * @returns {Promise<Object>} Newly created order item.
 */
exports.addOrderItem = async ({ order_id, game_id, amount, currency }) => {
  const result = await db.query(`
    INSERT INTO financials.order_items (order_id, game_id, amount, currency)
    VALUES ($1,$2,$3,$4)
    RETURNING *
  `, [order_id, game_id, amount, currency]);
  return result.rows[0];
};
