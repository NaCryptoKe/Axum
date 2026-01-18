const express = require('express');
const router = express.Router();
const {
    createSpace,
    getSpace,
    updateSpace,
    softDeleteSpace,
    createPost,
    getPost,
    getPostsBySpace,
    updatePost,
    softDeletePost,
    createComment,
    getComment,
    getCommentsByPost,
    updateComment,
    softDeleteComment,
    addPostVote,
    removePostVote
} = require('../controllers/communityController');

const authenticateMiddleware = require('../middlewares/authenticateMiddleware');
const isVerifiedMiddleware = require('../middlewares/isVerifiedMiddleware');

router.get('/health', (req, res) => {
    res.status(200).json({ success: true, message: "Community router is running." });
});

// All subsequent routes require authentication
router.use(authenticateMiddleware);
router.use(isVerifiedMiddleware);

// --- Space Routes ---
router.post('/spaces', createSpace);
router.get('/spaces/:id', getSpace); // Using :id for both ID and slug based on controller logic
router.put('/spaces/:id', updateSpace);
router.delete('/spaces/:id', softDeleteSpace);

// --- Post Routes ---
router.post('/posts', createPost);
router.get('/posts/:id', getPost);
router.get('/spaces/:space_id/posts', getPostsBySpace);
router.put('/posts/:id', updatePost);
router.delete('/posts/:id', softDeletePost);

// --- Comment Routes ---
router.post('/comments', createComment);
router.get('/comments/:id', getComment);
router.get('/posts/:post_id/comments', getCommentsByPost);
router.put('/comments/:id', updateComment);
router.delete('/comments/:id', softDeleteComment);

// --- Post Vote Routes ---
router.post('/posts/:post_id/vote', addPostVote);
router.delete('/posts/:post_id/vote', removePostVote);


module.exports = router;