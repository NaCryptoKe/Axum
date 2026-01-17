const express = require('express');
const request = require('supertest');
const gameRouter = require('../routes/gameRoute');
const gameController = require('../controllers/gameController');
const authenticateMiddleware = require('../middlewares/authenticateMiddleware');
const isVerifiedMiddleware = require('../middlewares/isVerifiedMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

jest.mock('../controllers/gameController');
jest.mock('../middlewares/authenticateMiddleware', () => (req, res, next) => {
    req.user = { id: 'test_user_id', username: 'testuser' };
    next();
});
jest.mock('../middlewares/isVerifiedMiddleware', () => (req, res, next) => next());
jest.mock('../middlewares/adminMiddleware', () => (req, res, next) => next());

const app = express();
app.use(express.json());
app.use('/games', gameRouter);

describe('Game Router', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /games/health', () => {
        it('should return 200 with a success message', async () => {
            const res = await request(app).get('/games/health');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual({ success: true, message: 'Game router is running.' });
        });
    });

    describe('POST /games', () => {
        it('should call createGame and return 201', async () => {
            const gameData = { name: 'Test Game', description: 'A fun game.' };
            gameController.createGame.mockImplementation((req, res) => res.status(201).json({ success: true, data: gameData }));
            const res = await request(app).post('/games').send(gameData);
            expect(res.statusCode).toEqual(201);
            expect(gameController.createGame).toHaveBeenCalled();
        });
    });

    describe('GET /games/org/:org_slug', () => {
        it('should call getOrganizationGames and return 200', async () => {
            const games = [{ name: 'Game 1' }, { name: 'Game 2' }];
            gameController.getOrganizationGames.mockImplementation((req, res) => res.status(200).json({ success: true, data: games }));
            const res = await request(app).get('/games/org/test-org');
            expect(res.statusCode).toEqual(200);
            expect(gameController.getOrganizationGames).toHaveBeenCalled();
        });
    });

    describe('GET /games/:org_slug/:game_slug', () => {
        it('should call getGame and return 200', async () => {
            const game = { name: 'Test Game' };
            gameController.getGame.mockImplementation((req, res) => res.status(200).json({ success: true, data: game }));
            const res = await request(app).get('/games/test-org/test-game');
            expect(res.statusCode).toEqual(200);
            expect(gameController.getGame).toHaveBeenCalled();
        });
    });

    describe('PUT /games/:id', () => {
        it('should call updateGame and return 200', async () => {
            const gameData = { name: 'Updated Game' };
            gameController.updateGame.mockImplementation((req, res) => res.status(200).json({ success: true, data: gameData }));
            const res = await request(app).put('/games/1').send(gameData);
            expect(res.statusCode).toEqual(200);
            expect(gameController.updateGame).toHaveBeenCalled();
        });
    });

    describe('DELETE /games/:id', () => {
        it('should call deleteGame and return 200', async () => {
            gameController.deleteGame.mockImplementation((req, res) => res.status(200).json({ success: true }));
            const res = await request(app).delete('/games/1');
            expect(res.statusCode).toEqual(200);
            expect(gameController.deleteGame).toHaveBeenCalled();
        });
    });

    describe('POST /games/create', () => {
        it('should call createGame and return 201', async () => {
            const gameData = { name: 'Test Game', description: 'A fun game.' };
            gameController.createGame.mockImplementation((req, res) => res.status(201).json({ success: true, data: gameData }));
            const res = await request(app).post('/games/create').send(gameData);
            expect(res.statusCode).toEqual(201);
            expect(gameController.createGame).toHaveBeenCalled();
        });
    });

    describe('PUT /games/update/:id', () => {
        it('should call updateGame and return 200', async () => {
            const gameData = { name: 'Updated Game' };
            gameController.updateGame.mockImplementation((req, res) => res.status(200).json({ success: true, data: gameData }));
            const res = await request(app).put('/games/update/1').send(gameData);
            expect(res.statusCode).toEqual(200);
            expect(gameController.updateGame).toHaveBeenCalled();
        });
    });

    describe('POST /games/versions', () => {
        it('should call createGameVersion and return 201', async () => {
            const versionData = { game_id: 1, version_string: '1.0.0' };
            gameController.createGameVersion.mockImplementation((req, res) => res.status(201).json({ success: true, data: versionData }));
            const res = await request(app).post('/games/versions').send(versionData);
            expect(res.statusCode).toEqual(201);
            expect(gameController.createGameVersion).toHaveBeenCalled();
        });
    });

    describe('GET /games/versions/:game_id', () => {
        it('should call getGameVersions and return 200', async () => {
            const versions = [{ version_string: '1.0.0' }];
            gameController.getGameVersions.mockImplementation((req, res) => res.status(200).json({ success: true, data: versions }));
            const res = await request(app).get('/games/versions/1');
            expect(res.statusCode).toEqual(200);
            expect(gameController.getGameVersions).toHaveBeenCalled();
        });
    });

    describe('POST /games/assets', () => {
        it('should call createGameAsset and return 201', async () => {
            const assetData = { version_id: 1, asset_type: 'image', asset_url: 'http://example.com/image.png' };
            gameController.createGameAsset.mockImplementation((req, res) => res.status(201).json({ success: true, data: assetData }));
            const res = await request(app).post('/games/assets').send(assetData);
            expect(res.statusCode).toEqual(201);
            expect(gameController.createGameAsset).toHaveBeenCalled();
        });
    });

    describe('GET /games/assets/:version_id', () => {
        it('should call getAssetsByVersion and return 200', async () => {
            const assets = [{ asset_type: 'image' }];
            gameController.getAssetsByVersion.mockImplementation((req, res) => res.status(200).json({ success: true, data: assets }));
            const res = await request(app).get('/games/assets/1');
            expect(res.statusCode).toEqual(200);
            expect(gameController.getAssetsByVersion).toHaveBeenCalled();
        });
    });

    describe('DELETE /games/assets/:id', () => {
        it('should call deleteGameAsset and return 200', async () => {
            gameController.deleteGameAsset.mockImplementation((req, res) => res.status(200).json({ success: true }));
            const res = await request(app).delete('/games/assets/1');
            expect(res.statusCode).toEqual(200);
            expect(gameController.deleteGameAsset).toHaveBeenCalled();
        });
    });

    describe('Tag Router', () => {
        describe('GET /games/tags/', () => {
            it('should call getAllTags and return 200', async () => {
                const tags = [{ name: 'Tag 1' }];
                gameController.getAllTags.mockImplementation((req, res) => res.status(200).json({ success: true, data: tags }));
                const res = await request(app).get('/games/tags/');
                expect(res.statusCode).toEqual(200);
                expect(gameController.getAllTags).toHaveBeenCalled();
            });
        });

        describe('POST /games/tags/', () => {
            it('should call createTag and return 201', async () => {
                const tagData = { name: 'New Tag' };
                gameController.createTag.mockImplementation((req, res) => res.status(201).json({ success: true, data: tagData }));
                const res = await request(app).post('/games/tags/').send(tagData);
                expect(res.statusCode).toEqual(201);
                expect(gameController.createTag).toHaveBeenCalled();
            });
        });

        describe('POST /games/tags/assign', () => {
            it('should call addTagToGame and return 200', async () => {
                const assignment = { game_id: 1, tag_id: 1 };
                gameController.addTagToGame.mockImplementation((req, res) => res.status(200).json({ success: true }));
                const res = await request(app).post('/games/tags/assign').send(assignment);
                expect(res.statusCode).toEqual(200);
                expect(gameController.addTagToGame).toHaveBeenCalled();
            });
        });

        describe('POST /games/tags/unassign', () => {
            it('should call removeTagFromGame and return 200', async () => {
                const assignment = { game_id: 1, tag_id: 1 };
                gameController.removeTagFromGame.mockImplementation((req, res) => res.status(200).json({ success: true }));
                const res = await request(app).post('/games/tags/unassign').send(assignment);
                expect(res.statusCode).toEqual(200);
                expect(gameController.removeTagFromGame).toHaveBeenCalled();
            });
        });
    });

    describe('Review Router', () => {
        describe('POST /games/reviews/', () => {
            it('should call createGameReview and return 201', async () => {
                const reviewData = { game_id: 1, rating: 5, comment: 'Great game!' };
                gameController.createGameReview.mockImplementation((req, res) => res.status(201).json({ success: true, data: reviewData }));
                const res = await request(app).post('/games/reviews/').send(reviewData);
                expect(res.statusCode).toEqual(201);
                expect(gameController.createGameReview).toHaveBeenCalled();
            });
        });

        describe('GET /games/reviews/:game_id', () => {
            it('should call getGameReviews and return 200', async () => {
                const reviews = [{ rating: 5, comment: 'Great game!' }];
                gameController.getGameReviews.mockImplementation((req, res) => res.status(200).json({ success: true, data: reviews }));
                const res = await request(app).get('/games/reviews/1');
                expect(res.statusCode).toEqual(200);
                expect(gameController.getGameReviews).toHaveBeenCalled();
            });
        });

        describe('DELETE /games/reviews/:id', () => {
            it('should call softDeleteGameReview and return 200', async () => {
                gameController.softDeleteGameReview.mockImplementation((req, res) => res.status(200).json({ success: true }));
                const res = await request(app).delete('/games/reviews/1');
                expect(res.statusCode).toEqual(200);
                expect(gameController.softDeleteGameReview).toHaveBeenCalled();
            });
        });
    });
});
