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
// needs a update version api

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
// should add a route to get all the tags of a certain game given it's id
router.use('/tags', tagRouter);

// --- Review Routes ---
const reviewRouter = express.Router();
reviewRouter.use(isVerifiedMiddleware);
reviewRouter.post('/', createGameReview); // If a user has already reviewd a game, they shouldn't be able to create another one only update the already existing one.
// A game dev shouldn't be able to review their own games.
reviewRouter.get('/:game_id', getGameReviews);
reviewRouter.delete('/:id', softDeleteGameReview);
router.use('/reviews', reviewRouter);

// --- Game Routes ---
router.post('/', isVerifiedMiddleware, createGame);
router.put('/:id', isVerifiedMiddleware, updateGame);
router.get('/org/:org_slug', getOrganizationGames);
router.get('/:org_slug/:game_slug', getGame);
router.delete('/:id', isVerifiedMiddleware, deleteGame);

module.exports = router;