const pool = require('../config/db');

// --- Follows ---

const followUser = async (follower_id, following_id) => {
    const { rows } = await pool.query(
        'INSERT INTO social.follows (follower_id, following_id) VALUES ($1, $2) RETURNING *',
        [follower_id, following_id]
    );
    return rows[0];
};

const unfollowUser = async (follower_id, following_id) => {
    const result = await pool.query(
        'DELETE FROM social.follows WHERE follower_id = $1 AND following_id = $2',
        [follower_id, following_id]
    );
    return result.rowCount;
};

const getFollowers = async (user_id) => {
    const { rows } = await pool.query(
        'SELECT u.* FROM core.users u JOIN social.follows f ON u.id = f.follower_id WHERE f.following_id = $1',
        [user_id]
    );
    return rows;
};

const getFollowing = async (user_id) => {
    const { rows } = await pool.query(
        'SELECT u.* FROM core.users u JOIN social.follows f ON u.id = f.following_id WHERE f.follower_id = $1',
        [user_id]
    );
    return rows;
};

const areFriends = async (user1_id, user2_id) => {
    const { rows } = await pool.query(
        `SELECT EXISTS (
            SELECT 1 FROM social.follows WHERE follower_id = $1 AND following_id = $2
        ) AND EXISTS (
            SELECT 1 FROM social.follows WHERE follower_id = $2 AND following_id = $1
        ) as are_friends`,
        [user1_id, user2_id]
    );
    return rows[0].are_friends;
}

// --- Conversations ---

const createConversation = async (type = 'private') => {
    const { rows } = await pool.query(
        'INSERT INTO social.conversations (type) VALUES ($1) RETURNING *',
        [type]
    );
    return rows[0];
};

const addParticipant = async (conversation_id, user_id, request_status = 'pending') => {
    const { rows } = await pool.query(
        'INSERT INTO social.conversation_participants (conversation_id, user_id, request_status) VALUES ($1, $2, $3) RETURNING *',
        [conversation_id, user_id, request_status]
    );
    return rows[0];
}

const getConversation = async (conversation_id) => {
    const { rows } = await pool.query(
        'SELECT * FROM social.conversations WHERE id = $1',
        [conversation_id]
    );
    return rows[0];
};

const getConversationsForUser = async (user_id) => {
    const { rows } = await pool.query(
        `SELECT c.* FROM social.conversations c
        JOIN social.conversation_participants cp ON c.id = cp.conversation_id
        WHERE cp.user_id = $1 AND cp.request_status = 'accepted'`,
        [user_id]
    );
    return rows;
};

const getMessageRequestsForUser = async (user_id) => {
    const { rows } = await pool.query(
        `SELECT c.* FROM social.conversations c
        JOIN social.conversation_participants cp ON c.id = cp.conversation_id
        WHERE cp.user_id = $1 AND cp.request_status = 'pending'`,
        [user_id]
    );
    return rows;
}

const updateParticipantStatus = async (conversation_id, user_id, status) => {
    const { rows } = await pool.query(
        'UPDATE social.conversation_participants SET request_status = $1 WHERE conversation_id = $2 AND user_id = $3 RETURNING *',
        [status, conversation_id, user_id]
    );
    return rows[0];
};

// --- Messages ---

const createMessage = async (conversation_id, sender_id, body) => {
    const { rows } = await pool.query(
        'INSERT INTO social.messages (conversation_id, sender_id, body) VALUES ($1, $2, $3) RETURNING *',
        [conversation_id, sender_id, body]
    );
    return rows[0];
};

const getMessagesInConversation = async (conversation_id) => {
    const { rows } = await pool.query(
        'SELECT * FROM social.messages WHERE conversation_id = $1 ORDER BY created_at ASC',
        [conversation_id]
    );
    return rows;
};


module.exports = {
    followUser,
    unfollowUser,
    getFollowers,
    getFollowing,
    areFriends,
    createConversation,
    addParticipant,
    getConversation,
    getConversationsForUser,
    getMessageRequestsForUser,
    updateParticipantStatus,
    createMessage,
    getMessagesInConversation
};