const express = require('express');
const {
    createGameController,
    updateGameController,
    softDeleteGameController,
    createVersionController,
    getGameVersionsController,
    updateVersionController
} = require('../controllers/gameController');

const router = express.Router();

// Test route
router.get('/', (req, res) => {
    res.json({ message: "HELLO GAMES WORKING!!" });
});

// -------------------
// GAME CRUD ROUTES
// -------------------
router.post('/create', createGameController);
router.put('/update', updateGameController);
router.post('/delete', softDeleteGameController);

// -------------------
// GAME VERSION ROUTES
// -------------------
router.post('/version/create', createVersionController);
router.get('/:game_id/versions', getGameVersionsController);
router.put('/version/update', updateVersionController);

module.exports = router;
