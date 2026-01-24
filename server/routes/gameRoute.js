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
    updateGameVersion,
    createGameAsset,
    getAssetsByVersion,
    deleteGameAsset,
    createTag,
    getAllTags,
    getTagsForGame,
    addTagToGame,
    removeTagFromGame,
    createGameReview,
    getGameReviews,
    updateGameReview,
    softDeleteGameReview,
    getPopularGames,
    getNewGames,
    getTopRatedGames,
    getGamesByTag,
    getPlayerLibrary
} = require('../controllers/gameController');

const { successResponse } = require('../utils/responseHandler');
const authenticateMiddleware = require('../middlewares/authenticateMiddleware');
const isVerifiedMiddleware = require('../middlewares/isVerifiedMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

router.get('/health', (req, res) => {
    return successResponse(res, "Game router is running.");
});

// Middleware for all subsequent routes
router.use(authenticateMiddleware);

router.get('/library', getPlayerLibrary)

// --- Game Version Routes ---
router.post('/versions', isVerifiedMiddleware, createGameVersion);
router.get('/versions/:game_id', getGameVersions);
router.put('/versions/:id', isVerifiedMiddleware, updateGameVersion);


// --- Game Asset Routes ---
router.post('/assets', isVerifiedMiddleware, createGameAsset);
router.get('/assets/:version_id', getAssetsByVersion);
router.delete('/assets/:id', isVerifiedMiddleware, deleteGameAsset);

// --- Tag Routes ---
const tagRouter = express.Router();
tagRouter.use(isVerifiedMiddleware);
tagRouter.get('/', getAllTags);
tagRouter.get('/:game_id', getTagsForGame);
tagRouter.post('/', adminMiddleware, createTag); // Only admins should create global tags
tagRouter.post('/assign', addTagToGame);
tagRouter.post('/unassign', removeTagFromGame);
router.use('/tags', tagRouter);

// --- Review Routes ---
const reviewRouter = express.Router();
reviewRouter.use(isVerifiedMiddleware);
reviewRouter.post('/', createGameReview); // If a user has already reviewed a game, they shouldn't be able to create another one only update the already existing one.
reviewRouter.put('/:id', updateGameReview);
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
router.get('/popular', getPopularGames);
router.get('/new', getNewGames);
router.get('/top-rated', getTopRatedGames);
router.get('/tag/:tag_id', getGamesByTag);

module.exports = router;