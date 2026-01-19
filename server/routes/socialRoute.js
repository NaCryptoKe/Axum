const express = require('express');
const router = express.Router();
const {
    followUser,
    unfollowUser,
    createConversation,
    getConversations,
    getMessageRequests,
    acceptMessageRequest,
    createMessage,
    getMessages
} = require('../controllers/socialController');

const authenticateMiddleware = require('../middlewares/authenticateMiddleware');

router.get('/health', (req, res) => {
    res.status(200).json({ success: true, message: "Social router is running." });
});

router.use(authenticateMiddleware);

// --- Follows ---
router.post('/follow', followUser);
router.post('/unfollow', unfollowUser);

// --- Conversations ---
router.post('/conversations', createConversation);
router.get('/conversations', getConversations);
router.get('/conversations/requests', getMessageRequests);
router.post('/conversations/:conversation_id/accept', acceptMessageRequest);

// --- Messages ---
router.post('/conversations/:conversation_id/messages', createMessage);
router.get('/conversations/:conversation_id/messages', getMessages);


module.exports = router;