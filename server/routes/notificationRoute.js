const express = require('express');
const router = express.Router();
const {
    getNotifications,
    markAsRead,
    deleteNotification,
    setPreferences,
    getPreferences
} = require('../controllers/notificationController');

const authenticateMiddleware = require('../middlewares/authenticateMiddleware');

router.get('/health', (req, res) => {
    res.status(200).json({ success: true, message: "Notification router is running." });
});

router.use(authenticateMiddleware); // All notification routes require authentication

// --- Notification Items ---
router.get('/', getNotifications);
router.put('/:id/read', markAsRead);
router.delete('/:id', deleteNotification);

// --- Notification Preferences ---
router.get('/preferences', getPreferences);
router.post('/preferences', setPreferences);


module.exports = router;