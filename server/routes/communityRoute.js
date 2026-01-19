const express = require('express');
const router = express.Router();
const {
    createSpace,
    getSpace,
    updateSpace,
    softDeleteSpace,
    undeleteSpace,
    createPost,
    getPost,
    getPostsBySpace,
    updatePost,
    softDeletePost,
    undeletePost,
    createComment,
    getComment,
    getCommentsByPost,
    updateComment,
    softDeleteComment,
    undeleteComment,
    addPostVote,
    removePostVote,
    addCommentVote,
    removeCommentVote
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
router.get('/spaces/:slug', getSpace);
router.put('/spaces/:id', updateSpace);
router.delete('/spaces/:id', softDeleteSpace);
router.put('/spaces/:id/undelete', undeleteSpace);

// --- Post Routes ---
router.post('/posts', createPost);
router.get('/posts/:id', getPost);
router.get('/spaces/:space_slug/posts', getPostsBySpace);
router.put('/posts/:id', updatePost);
router.delete('/posts/:id', softDeletePost);
router.put('/posts/:id/undelete', undeletePost);

// --- Comment Routes ---
router.post('/comments', createComment);
router.get('/comments/:id', getComment);
router.get('/posts/:post_id/comments', getCommentsByPost);
router.put('/comments/:id', updateComment);
router.delete('/comments/:id', softDeleteComment);
router.put('/comments/:id/undelete', undeleteComment);

// --- Post Vote Routes ---
router.post('/posts/:post_id/vote', addPostVote);
router.delete('/posts/:post_id/vote', removePostVote);

// --- Comment Vote Routes ---
router.post('/comments/:comment_id/vote', addCommentVote);
router.delete('/comments/:comment_id/vote', removeCommentVote);


module.exports = router;