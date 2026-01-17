const express = require('express');
const request = require('supertest');
const adminRouter = require('../routes/adminRoute');
const userController = require('../controllers/userController');
const adminMiddleware = require('../middlewares/adminMiddleware');
const authenticateMiddleware = require('../middlewares/authenticateMiddleware');

jest.mock('../controllers/userController');
jest.mock('../middlewares/adminMiddleware', () => (req, res, next) => next());
jest.mock('../middlewares/authenticateMiddleware', () => (req, res, next) => next());

const app = express();
app.use(express.json());
app.use('/admin', authenticateMiddleware, adminMiddleware, adminRouter);

describe('Admin Router', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /admin/', () => {
        it('should return 200 with a success message', async () => {
            const res = await request(app).get('/admin/');
            expect(res.statusCode).toEqual(200);
            expect(res.text).toBe('ADMIN WORKING');
        });
    });

    describe('GET /admin/users', () => {
        it('should call allUsers and return 200', async () => {
            userController.allUsers.mockImplementation((req, res) => res.status(200).json({ success: true }));
            const res = await request(app).get('/admin/users');
            expect(res.statusCode).toEqual(200);
            expect(userController.allUsers).toHaveBeenCalled();
        });
    });

    describe('GET /admin/users/active', () => {
        it('should call allActiveUsers and return 200', async () => {
            userController.allActiveUsers.mockImplementation((req, res) => res.status(200).json({ success: true }));
            const res = await request(app).get('/admin/users/active');
            expect(res.statusCode).toEqual(200);
            expect(userController.allActiveUsers).toHaveBeenCalled();
        });
    });

    describe('DELETE /admin/@:username', () => {
        it('should call softDelete and return 200', async () => {
            userController.softDelete.mockImplementation((req, res) => res.status(200).json({ success: true }));
            const res = await request(app).delete('/admin/@testuser');
            expect(res.statusCode).toEqual(200);
            expect(userController.softDelete).toHaveBeenCalled();
        });
    });
});
