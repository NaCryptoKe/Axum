const pool = require('../config/db');

/* =====================================================
   ORDERS
===================================================== */

/**
 * Creates a new order.
 * @param {object} orderDetails - The order details.
 * @param {string} orderDetails.user_id - The ID of the user placing the order.
 * @param {string} orderDetails.status - The initial status of the order (e.g., 'pending').
 * @param {number} orderDetails.total_amount - The total amount of the order.
 * @param {string} orderDetails.currency - The currency of the order (e.g., 'USD').
 * @returns {Promise<object>} The created order.
 */
const createOrder = async ({ user_id, status, total_amount, currency }) => {
    const { rows } = await pool.query(
        `INSERT INTO financials.orders (user_id, status, total_amount, currency)
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [user_id, status, total_amount, currency]
    );
    return rows[0];
};

/**
 * Updates an order's status and provider transaction ID.
 * @param {string} order_id - The ID of the order to update.
 * @param {string} status - The new status of the order.
 * @param {string} provider_txn_id - The transaction ID from the payment provider.
 * @returns {Promise<object>} The updated order.
 */
const updateOrderStatus = async (order_id, status, provider_txn_id) => {
    const { rows } = await pool.query(
        `UPDATE financials.orders
         SET status = $2, provider_txn_id = $3, updated_at = NOW()
         WHERE id = $1 RETURNING *`,
        [order_id, status, provider_txn_id]
    );
    return rows[0];
};

/**
 * Gets an order by its ID.
 * @param {string} order_id - The ID of the order.
 * @returns {Promise<object>} The order details.
 */
const getOrderById = async (order_id) => {
    const { rows } = await pool.query('SELECT * FROM financials.orders WHERE id = $1', [order_id]);
    return rows[0];
};

/* =====================================================
   ORDER ITEMS
===================================================== */

/**
 * Adds an item to an existing order.
 * @param {object} itemDetails - The order item details.
 * @param {string} itemDetails.order_id - The ID of the order.
 * @param {string} itemDetails.game_id - The ID of the game being purchased.
 * @param {number} itemDetails.amount - The price of the item.
 * @param {string} itemDetails.currency - The currency of the item price.
 * @returns {Promise<object>} The created order item.
 */
const addOrderItem = async ({ order_id, game_id, amount, currency }) => {
    const { rows } = await pool.query(
        `INSERT INTO financials.order_items (order_id, game_id, amount, currency)
         VALUES ($1, $2, $3, $4) RETURNING *`,
        [order_id, game_id, amount, currency]
    );
    return rows[0];
};

/**
 * Gets all items associated with an order.
 * @param {string} order_id - The ID of the order.
 * @returns {Promise<Array<object>>} A list of order items.
 */
const getOrderItems = async (order_id) => {
    const { rows } = await pool.query('SELECT * FROM financials.order_items WHERE order_id = $1', [order_id]);
    return rows;
};

module.exports = {
    // Orders
    createOrder,
    updateOrderStatus,
    getOrderById,
    // Order Items
    addOrderItem,
    getOrderItems,
};
