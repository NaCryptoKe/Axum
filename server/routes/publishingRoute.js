const express = require('express');
const router = express.Router();
const {
    createCategory,
    getAllCategories,
    createArticle,
    getArticle,
    getArticlesByOrganization,
    updateArticle,
    deleteArticle
} = require('../controllers/publishingController');

const authenticateMiddleware = require('../middlewares/authenticateMiddleware');
const isVerifiedMiddleware = require('../middlewares/isVerifiedMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware'); // For category creation, if restricted

router.get('/health', (req, res) => {
    res.status(200).json({ success: true, message: "Publishing router is running." });
});

router.use(authenticateMiddleware); // All publishing routes require authentication

// --- Category Routes ---
router.post('/categories', isVerifiedMiddleware, adminMiddleware, createCategory); // Only admins/devs can create categories
router.get('/categories', getAllCategories);

// --- Article Routes ---
router.post('/articles', isVerifiedMiddleware, createArticle);
router.get('/articles/:id', getArticle);
router.get('/organizations/:org_id/articles', getArticlesByOrganization);
router.put('/articles/:id', isVerifiedMiddleware, updateArticle);
router.delete('/articles/:id', isVerifiedMiddleware, deleteArticle);

module.exports = router;