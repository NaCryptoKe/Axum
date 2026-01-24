const socialModel = require('../models/socialModel');

const followUser = async (req, res) => {
    const { user } = req;
    const { user_id } = req.body;
    if (!user?.id) return res.status(401).json({ status: "error", message: "Unauthorized", error: { code: 401, details: "User not authenticated." }, meta: { timestamp: new Date().toISOString() } });
    if (!user_id) return res.status(400).json({ status: "error", message: "user_id is required", error: { code: 400, details: "user_id is required" }, meta: { timestamp: new Date().toISOString() } });

    try {
        const follow = await socialModel.followUser(user.id, user_id);
        return res.status(201).json({ status: "success", message: "Successfully followed user", data: follow, meta: { timestamp: new Date().toISOString() } });
    } catch (error) {
        console.error("Follow User Error:", error);
        return res.status(500).json({ status: "error", message: "Server Error", error: { code: 500, details: error.message }, meta: { timestamp: new Date().toISOString() } });
    }
};

const unfollowUser = async (req, res) => {
    const { user } = req;
    const { user_id } = req.body;
    if (!user?.id) return res.status(401).json({ status: "error", message: "Unauthorized", error: { code: 401, details: "User not authenticated." }, meta: { timestamp: new Date().toISOString() } });
    if (!user_id) return res.status(400).json({ status: "error", message: "user_id is required", error: { code: 400, details: "user_id is required" }, meta: { timestamp: new Date().toISOString() } });

    try {
        const rowCount = await socialModel.unfollowUser(user.id, user_id);
        if (rowCount === 0) return res.status(404).json({ status: "error", message: "Not following user", error: { code: 404, details: "Not following user" }, meta: { timestamp: new Date().toISOString() } });
        return res.status(200).json({ status: "success", message: "Successfully unfollowed user", data: null, meta: { timestamp: new Date().toISOString() } });
    } catch (error) {
        console.error("Unfollow User Error:", error);
        return res.status(500).json({ status: "error", message: "Server Error", error: { code: 500, details: error.message }, meta: { timestamp: new Date().toISOString() } });
    }
};

const createConversation = async (req, res) => {
    const { user } = req;
    const { recipient_id } = req.body;
    if (!user?.id) return res.status(401).json({ status: "error", message: "Unauthorized", error: { code: 401, details: "User not authenticated." }, meta: { timestamp: new Date().toISOString() } });
    if (!recipient_id) return res.status(400).json({ status: "error", message: "recipient_id is required", error: { code: 400, details: "recipient_id is required" }, meta: { timestamp: new Date().toISOString() } });

    try {
        const areFriends = await socialModel.areFriends(user.id, recipient_id);
        const conversation = await socialModel.createConversation();
        await socialModel.addParticipant(conversation.id, user.id, 'accepted');
        await socialModel.addParticipant(conversation.id, recipient_id, areFriends ? 'accepted' : 'pending');
        return res.status(201).json({ status: "success", message: "Successfully created conversation", data: conversation, meta: { timestamp: new Date().toISOString() } });
    } catch (error) {
        console.error("Create Conversation Error:", error);
        return res.status(500).json({ status: "error", message: "Server Error", error: { code: 500, details: error.message }, meta: { timestamp: new Date().toISOString() } });
    }
}

const getConversations = async (req, res) => {
    const { user } = req;
    if (!user?.id) return res.status(401).json({ status: "error", message: "Unauthorized", error: { code: 401, details: "User not authenticated." }, meta: { timestamp: new Date().toISOString() } });

    try {
        const conversations = await socialModel.getConversationsForUser(user.id);
        return res.status(200).json({ status: "success", message: "Successfully retrieved conversations", data: conversations, meta: { timestamp: new Date().toISOString() } });
    } catch (error) {
        console.error("Get Conversations Error:", error);
        return res.status(500).json({ status: "error", message: "Server Error", error: { code: 500, details: error.message }, meta: { timestamp: new Date().toISOString() } });
    }
}

const getMessageRequests = async (req, res) => {
    const { user } = req;
    if (!user?.id) return res.status(401).json({ status: "error", message: "Unauthorized", error: { code: 401, details: "User not authenticated." }, meta: { timestamp: new Date().toISOString() } });

    try {
        const conversations = await socialModel.getMessageRequestsForUser(user.id);
        return res.status(200).json({ status: "success", message: "Successfully retrieved message requests", data: conversations, meta: { timestamp: new Date().toISOString() } });
    } catch (error) {
        console.error("Get Message Requests Error:", error);
        return res.status(500).json({ status: "error", message: "Server Error", error: { code: 500, details: error.message }, meta: { timestamp: new Date().toISOString() } });
    }
}

const acceptMessageRequest = async (req, res) => {
    const { user } = req;
    const { conversation_id } = req.params;
    if (!user?.id) return res.status(401).json({ status: "error", message: "Unauthorized", error: { code: 401, details: "User not authenticated." }, meta: { timestamp: new Date().toISOString() } });

    try {
        const participant = await socialModel.updateParticipantStatus(conversation_id, user.id, 'accepted');
        return res.status(200).json({ status: "success", message: "Successfully accepted message request", data: participant, meta: { timestamp: new Date().toISOString() } });
    } catch (error) {
        console.error("Accept Message Request Error:", error);
        return res.status(500).json({ status: "error", message: "Server Error", error: { code: 500, details: error.message }, meta: { timestamp: new Date().toISOString() } });
    }
}

const createMessage = async (req, res) => {
    const { user } = req;
    const { conversation_id } = req.params;
    const { body } = req.body;
    if (!user?.id) return res.status(401).json({ status: "error", message: "Unauthorized", error: { code: 401, details: "User not authenticated." }, meta: { timestamp: new Date().toISOString() } });
    if (!body) return res.status(400).json({ status: "error", message: "body is required", error: { code: 400, details: "body is required" }, meta: { timestamp: new Date().toISOString() } });

    try {
        // TODO: Check if user is a participant in the conversation
        const message = await socialModel.createMessage(conversation_id, user.id, body);
        return res.status(201).json({ status: "success", message: "Successfully created message", data: message, meta: { timestamp: new Date().toISOString() } });
    } catch (error) {
        console.error("Create Message Error:", error);
        return res.status(500).json({ status: "error", message: "Server Error", error: { code: 500, details: error.message }, meta: { timestamp: new Date().toISOString() } });
    }
};

const getMessages = async (req, res) => {
    const { user } = req;
    const { conversation_id } = req.params;
    if (!user?.id) return res.status(401).json({ status: "error", message: "Unauthorized", error: { code: 401, details: "User not authenticated." }, meta: { timestamp: new Date().toISOString() } });

    try {
        // TODO: Check if user is a participant in the conversation
        const messages = await socialModel.getMessagesInConversation(conversation_id);
        return res.status(200).json({ status: "success", message: "Successfully retrieved messages", data: messages, meta: { timestamp: new Date().toISOString() } });
    } catch (error) {
        console.error("Get Messages Error:", error);
        return res.status(500).json({ status: "error", message: "Server Error", error: { code: 500, details: error.message }, meta: { timestamp: new Date().toISOString() } });
    }
};

module.exports = {
    followUser,
    unfollowUser,
    createConversation,
    getConversations,
    getMessageRequests,
    acceptMessageRequest,
    createMessage,
    getMessages
};