const socialModel = require('../models/socialModel');

const followUser = async (req, res) => {
    const { user } = req;
    const { user_id } = req.body;
    if (!user?.id) return res.status(401).json({ success: false, message: "Unauthorized" });
    if (!user_id) return res.status(400).json({ success: false, message: "user_id is required" });

    try {
        const follow = await socialModel.followUser(user.id, user_id);
        return res.status(201).json({ success: true, message: "Successfully followed user", data: follow });
    } catch (error) {
        console.error("Follow User Error:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

const unfollowUser = async (req, res) => {
    const { user } = req;
    const { user_id } = req.body;
    if (!user?.id) return res.status(401).json({ success: false, message: "Unauthorized" });
    if (!user_id) return res.status(400).json({ success: false, message: "user_id is required" });

    try {
        const rowCount = await socialModel.unfollowUser(user.id, user_id);
        if (rowCount === 0) return res.status(404).json({ success: false, message: "Not following user" });
        return res.status(200).json({ success: true, message: "Successfully unfollowed user" });
    } catch (error) {
        console.error("Unfollow User Error:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

const createConversation = async (req, res) => {
    const { user } = req;
    const { recipient_id } = req.body;
    if (!user?.id) return res.status(401).json({ success: false, message: "Unauthorized" });
    if (!recipient_id) return res.status(400).json({ success: false, message: "recipient_id is required" });

    try {
        const areFriends = await socialModel.areFriends(user.id, recipient_id);
        const conversation = await socialModel.createConversation();
        await socialModel.addParticipant(conversation.id, user.id, 'accepted');
        await socialModel.addParticipant(conversation.id, recipient_id, areFriends ? 'accepted' : 'pending');
        return res.status(201).json({ success: true, message: "Successfully created conversation", data: conversation });
    } catch (error) {
        console.error("Create Conversation Error:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
}

const getConversations = async (req, res) => {
    const { user } = req;
    if (!user?.id) return res.status(401).json({ success: false, message: "Unauthorized" });

    try {
        const conversations = await socialModel.getConversationsForUser(user.id);
        return res.status(200).json({ success: true, message: "Successfully retrieved conversations", data: conversations });
    } catch (error) {
        console.error("Get Conversations Error:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
}

const getMessageRequests = async (req, res) => {
    const { user } = req;
    if (!user?.id) return res.status(401).json({ success: false, message: "Unauthorized" });

    try {
        const conversations = await socialModel.getMessageRequestsForUser(user.id);
        return res.status(200).json({ success: true, message: "Successfully retrieved message requests", data: conversations });
    } catch (error) {
        console.error("Get Message Requests Error:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
}

const acceptMessageRequest = async (req, res) => {
    const { user } = req;
    const { conversation_id } = req.params;
    if (!user?.id) return res.status(401).json({ success: false, message: "Unauthorized" });

    try {
        const participant = await socialModel.updateParticipantStatus(conversation_id, user.id, 'accepted');
        return res.status(200).json({ success: true, message: "Successfully accepted message request", data: participant });
    } catch (error) {
        console.error("Accept Message Request Error:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
}

const createMessage = async (req, res) => {
    const { user } = req;
    const { conversation_id } = req.params;
    const { body } = req.body;
    if (!user?.id) return res.status(401).json({ success: false, message: "Unauthorized" });
    if (!body) return res.status(400).json({ success: false, message: "body is required" });

    try {
        // TODO: Check if user is a participant in the conversation
        const message = await socialModel.createMessage(conversation_id, user.id, body);
        return res.status(201).json({ success: true, message: "Successfully created message", data: message });
    } catch (error) {
        console.error("Create Message Error:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
};

const getMessages = async (req, res) => {
    const { user } = req;
    const { conversation_id } = req.params;
    if (!user?.id) return res.status(401).json({ success: false, message: "Unauthorized" });

    try {
        // TODO: Check if user is a participant in the conversation
        const messages = await socialModel.getMessagesInConversation(conversation_id);
        return res.status(200).json({ success: true, message: "Successfully retrieved messages", data: messages });
    } catch (error) {
        console.error("Get Messages Error:", error);
        return res.status(500).json({ success: false, message: "Server Error" });
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