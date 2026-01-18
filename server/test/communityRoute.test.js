const express = require('express');
const request = require('supertest');
const communityRouter = require('../routes/communityRoute');
const communityController = require('../controllers/communityController');

jest.mock('../controllers/communityController');
jest.mock('../middlewares/authenticateMiddleware', () => (req, res, next) => {
    req.user = { id: 'test_user_id', username: 'testuser' };
    next();
});
jest.mock('../middlewares/isVerifiedMiddleware', () => (req, res, next) => next());

const app = express();
app.use(express.json());
app.use('/api/community', communityRouter);

describe('Community Router', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /api/community/health', () => {
        it('should return 200 with a success message', async () => {
            const res = await request(app).get('/api/community/health');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual({ success: true, message: 'Community router is running.' });
        });
    });

    // --- Space Routes ---
    describe('Space Routes', () => {
        const spaceData = { name: 'Test Space', slug: 'test-space', description: 'A space for testing.' };
        const spaceId = 'space_id_123';

        describe('POST /api/community/spaces', () => {
            it('should call createSpace and return 201', async () => {
                communityController.createSpace.mockImplementation((req, res) => res.status(201).json({ success: true, data: spaceData }));
                const res = await request(app).post('/api/community/spaces').send(spaceData);
                expect(res.statusCode).toEqual(201);
                expect(communityController.createSpace).toHaveBeenCalled();
            });
        });

        describe('GET /api/community/spaces/:id', () => {
            it('should call getSpace and return 200', async () => {
                communityController.getSpace.mockImplementation((req, res) => res.status(200).json({ success: true, data: spaceData }));
                const res = await request(app).get(`/api/community/spaces/${spaceId}`);
                expect(res.statusCode).toEqual(200);
                expect(communityController.getSpace).toHaveBeenCalled();
            });
        });

        describe('PUT /api/community/spaces/:id', () => {
            it('should call updateSpace and return 200', async () => {
                const updatedSpaceData = { name: 'Updated Space' };
                communityController.updateSpace.mockImplementation((req, res) => res.status(200).json({ success: true, data: { ...spaceData, ...updatedSpaceData } }));
                const res = await request(app).put(`/api/community/spaces/${spaceId}`).send(updatedSpaceData);
                expect(res.statusCode).toEqual(200);
                expect(communityController.updateSpace).toHaveBeenCalled();
            });
        });

        describe('DELETE /api/community/spaces/:id', () => {
            it('should call softDeleteSpace and return 200', async () => {
                communityController.softDeleteSpace.mockImplementation((req, res) => res.status(200).json({ success: true }));
                const res = await request(app).delete(`/api/community/spaces/${spaceId}`);
                expect(res.statusCode).toEqual(200);
                expect(communityController.softDeleteSpace).toHaveBeenCalled();
            });
        });
    });

    // --- Post Routes ---
    describe('Post Routes', () => {
        const postData = { space_id: 'space_id_1', title: 'Test Post', body: 'This is a test post.' };
        const postId = 'post_id_123';
        const spaceId = 'space_id_1';

        describe('POST /api/community/posts', () => {
            it('should call createPost and return 201', async () => {
                communityController.createPost.mockImplementation((req, res) => res.status(201).json({ success: true, data: postData }));
                const res = await request(app).post('/api/community/posts').send(postData);
                expect(res.statusCode).toEqual(201);
                expect(communityController.createPost).toHaveBeenCalled();
            });
        });

        describe('GET /api/community/posts/:id', () => {
            it('should call getPost and return 200', async () => {
                communityController.getPost.mockImplementation((req, res) => res.status(200).json({ success: true, data: postData }));
                const res = await request(app).get(`/api/community/posts/${postId}`);
                expect(res.statusCode).toEqual(200);
                expect(communityController.getPost).toHaveBeenCalled();
            });
        });

        describe('GET /api/community/spaces/:space_id/posts', () => {
            it('should call getPostsBySpace and return 200', async () => {
                const posts = [postData];
                communityController.getPostsBySpace.mockImplementation((req, res) => res.status(200).json({ success: true, data: posts }));
                const res = await request(app).get(`/api/community/spaces/${spaceId}/posts`);
                expect(res.statusCode).toEqual(200);
                expect(communityController.getPostsBySpace).toHaveBeenCalled();
            });
        });

        describe('PUT /api/community/posts/:id', () => {
            it('should call updatePost and return 200', async () => {
                const updatedPostData = { body: 'Updated body.' };
                communityController.updatePost.mockImplementation((req, res) => res.status(200).json({ success: true, data: { ...postData, ...updatedPostData } }));
                const res = await request(app).put(`/api/community/posts/${postId}`).send(updatedPostData);
                expect(res.statusCode).toEqual(200);
                expect(communityController.updatePost).toHaveBeenCalled();
            });
        });

        describe('DELETE /api/community/posts/:id', () => {
            it('should call softDeletePost and return 200', async () => {
                communityController.softDeletePost.mockImplementation((req, res) => res.status(200).json({ success: true }));
                const res = await request(app).delete(`/api/community/posts/${postId}`);
                expect(res.statusCode).toEqual(200);
                expect(communityController.softDeletePost).toHaveBeenCalled();
            });
        });
    });

    // --- Comment Routes ---
    describe('Comment Routes', () => {
        const commentData = { post_id: 'post_id_1', author_id: 'test_user_id', body: 'Nice post!' };
        const commentId = 'comment_id_123';
        const postId = 'post_id_1';

        describe('POST /api/community/comments', () => {
            it('should call createComment and return 201', async () => {
                communityController.createComment.mockImplementation((req, res) => res.status(201).json({ success: true, data: commentData }));
                const res = await request(app).post('/api/community/comments').send(commentData);
                expect(res.statusCode).toEqual(201);
                expect(communityController.createComment).toHaveBeenCalled();
            });
        });

        describe('GET /api/community/comments/:id', () => {
            it('should call getComment and return 200', async () => {
                communityController.getComment.mockImplementation((req, res) => res.status(200).json({ success: true, data: commentData }));
                const res = await request(app).get(`/api/community/comments/${commentId}`);
                expect(res.statusCode).toEqual(200);
                expect(communityController.getComment).toHaveBeenCalled();
            });
        });

        describe('GET /api/community/posts/:post_id/comments', () => {
            it('should call getCommentsByPost and return 200', async () => {
                const comments = [commentData];
                communityController.getCommentsByPost.mockImplementation((req, res) => res.status(200).json({ success: true, data: comments }));
                const res = await request(app).get(`/api/community/posts/${postId}/comments`);
                expect(res.statusCode).toEqual(200);
                expect(communityController.getCommentsByPost).toHaveBeenCalled();
            });
        });

        describe('PUT /api/community/comments/:id', () => {
            it('should call updateComment and return 200', async () => {
                const updatedCommentData = { body: 'Updated comment body.' };
                communityController.updateComment.mockImplementation((req, res) => res.status(200).json({ success: true, data: { ...commentData, ...updatedCommentData } }));
                const res = await request(app).put(`/api/community/comments/${commentId}`).send(updatedCommentData);
                expect(res.statusCode).toEqual(200);
                expect(communityController.updateComment).toHaveBeenCalled();
            });
        });

        describe('DELETE /api/community/comments/:id', () => {
            it('should call softDeleteComment and return 200', async () => {
                communityController.softDeleteComment.mockImplementation((req, res) => res.status(200).json({ success: true }));
                const res = await request(app).delete(`/api/community/comments/${commentId}`);
                expect(res.statusCode).toEqual(200);
                expect(communityController.softDeleteComment).toHaveBeenCalled();
            });
        });
    });

    // --- Post Vote Routes ---
    describe('Post Vote Routes', () => {
        const postId = 'post_id_1';
        const voteData = { post_id: postId, value: 1 };

        describe('POST /api/community/posts/:post_id/vote', () => {
            it('should call addPostVote and return 201', async () => {
                communityController.addPostVote.mockImplementation((req, res) => res.status(201).json({ success: true, data: voteData }));
                const res = await request(app).post(`/api/community/posts/${postId}/vote`).send({ value: 1 });
                expect(res.statusCode).toEqual(201);
                expect(communityController.addPostVote).toHaveBeenCalled();
            });
        });

        describe('DELETE /api/community/posts/:post_id/vote', () => {
            it('should call removePostVote and return 200', async () => {
                communityController.removePostVote.mockImplementation((req, res) => res.status(200).json({ success: true }));
                const res = await request(app).delete(`/api/community/posts/${postId}/vote`);
                expect(res.statusCode).toEqual(200);
                expect(communityController.removePostVote).toHaveBeenCalled();
            });
        });
    });
});