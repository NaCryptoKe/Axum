const express = require('express');
const router = express.Router();
const {
    createGame,
    getGame,
    getOrganizationGames,
    updateGame,
    deleteGame,
    createGameVersion,
    getGameVersions,
    createGameAsset,
    getAssetsByVersion,
    deleteGameAsset,
    createTag,
    getAllTags,
    addTagToGame,
    removeTagFromGame,
    createGameReview,
    getGameReviews,
    softDeleteGameReview
} = require('../controllers/gameController');

const authenticateMiddleware = require('../middlewares/authenticateMiddleware');
const isVerifiedMiddleware = require('../middlewares/isVerifiedMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

router.get('/health', (req, res) => {
    res.status(200).json({ success: true, message: "Game router is running." });
});

// Middleware for all subsequent routes
router.use(authenticateMiddleware);

// --- Game Version Routes ---
router.post('/versions', isVerifiedMiddleware, createGameVersion);
router.get('/versions/:game_id', getGameVersions);

// --- Game Asset Routes ---
router.post('/assets', isVerifiedMiddleware, createGameAsset);
router.get('/assets/:version_id', getAssetsByVersion);
router.delete('/assets/:id', isVerifiedMiddleware, deleteGameAsset);

// --- Tag Routes ---
const tagRouter = express.Router();
tagRouter.use(isVerifiedMiddleware);
tagRouter.get('/', getAllTags);
tagRouter.post('/', adminMiddleware, createTag); // Only admins should create global tags
tagRouter.post('/assign', addTagToGame);
tagRouter.post('/unassign', removeTagFromGame);
router.use('/tags', tagRouter);

// --- Review Routes ---
const reviewRouter = express.Router();
reviewRouter.use(isVerifiedMiddleware);
reviewRouter.post('/', createGameReview);
reviewRouter.get('/:game_id', getGameReviews);
reviewRouter.delete('/:id', softDeleteGameReview);
router.use('/reviews', reviewRouter);

// --- Game Routes ---
router.post('/', isVerifiedMiddleware, createGame);
router.get('/org/:org_slug', getOrganizationGames);
router.get('/:org_slug/:game_slug', getGame);
router.put('/:id', isVerifiedMiddleware, updateGame);
router.delete('/:id', isVerifiedMiddleware, deleteGame);

module.exports = router;