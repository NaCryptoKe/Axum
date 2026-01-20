const pool = require('../config/db');

/**
 * Adds a game to a user's library.
 * @param {string} user_id - The user's ID.
 * @param {string} game_id - The game's ID.
 * @returns {Promise<object>} The new library entry.
 */
const addGameToLibrary = async (user_id, game_id) => {
    const { rows } = await pool.query(
        `INSERT INTO player_data.libraries (user_id, game_id)
         VALUES ($1, $2)
         ON CONFLICT (user_id, game_id) DO NOTHING
         RETURNING *`,
        [user_id, game_id]
    );
    return rows[0];
};

/**
 * Retrieves a user's game library.
 * @param {string} user_id - The user's ID.
 * @returns {Promise<Array<object>>} A list of games in the user's library.
 */
const getUserLibrary = async (user_id) => {
    const { rows } = await pool.query(
        `SELECT * FROM player_data.libraries
         JOIN game_catalog.games ON game_catalog.games.id = player_data.libraries.game_id
         WHERE player_data.libraries.user_id = $1 AND game_catalog.games.is_deleted = false`,
        [user_id]
    );
    return rows;
};

/**
 * Checks if a user has a specific game in their library.
 * @param {string} user_id - The user's ID.
 * @param {string} game_id - The game's ID.
 * @returns {Promise<boolean>} True if the user has the game, false otherwise.
 */
const userHasGame = async (user_id, game_id) => {
    const { rows } = await pool.query(
        'SELECT 1 FROM player_data.libraries WHERE user_id = $1 AND game_id = $2',
        [user_id, game_id]
    );
    return rows.length > 0;
};

/**
 * Updates the playtime and last played timestamp for a game in a user's library.
 * @param {string} user_id - The user's ID.
 * @param {string} game_id - The game's ID.
 * @param {number} additional_playtime_seconds - The number of seconds to add to the playtime.
 * @returns {Promise<object>} The updated library entry.
 */
const updatePlaytime = async (user_id, game_id, additional_playtime_seconds) => {
    const { rows } = await pool.query(
        `UPDATE player_data.libraries
         SET playtime_seconds = playtime_seconds + $3, last_played_at = NOW()
         WHERE user_id = $1 AND game_id = $2
         RETURNING *`,
        [user_id, game_id, additional_playtime_seconds]
    );
    return rows[0];
};

module.exports = {
    addGameToLibrary,
    getUserLibrary,
    userHasGame,
    updatePlaytime,
};
