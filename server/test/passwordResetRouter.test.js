const express = require('express');
const request = require('supertest');
const passwordResetRouter = require('../routes/passwordResetRouter');
const passwordResetController = require('../controllers/passwordResetController');
const { rateLimiter } = require('../middlewares/rateLimiter');
const { checkCooldown } = require('../middlewares/checkCooldown');

jest.mock('../controllers/passwordResetController');
jest.mock('../middlewares/rateLimiter', () => ({
    rateLimiter: (req, res, next) => next()
}));
jest.mock('../middlewares/checkCooldown', () => ({
    checkCooldown: (req, res, next) => next()
}));

const app = express();
app.use(express.json());
app.use('/password-reset', passwordResetRouter);

describe('Password Reset Router', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /password-reset/', () => {
        it('should return 200 with a success message', async () => {
            const res = await request(app).get('/password-reset/');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual({
                success: true,
                message: 'Password Reset Router is working',
                data: null,
                error: null
            });
        });
    });

    describe('POST /password-reset/generate-password-reset', () => {
        it('should call generatePasswordResetToken and return 200', async () => {
            passwordResetController.generatePasswordResetToken.mockImplementation((req, res) => res.status(200).json({ success: true }));
            const res = await request(app).post('/password-reset/generate-password-reset').send({ email: 'test@test.com' });
            expect(res.statusCode).toEqual(200);
            expect(passwordResetController.generatePasswordResetToken).toHaveBeenCalled();
        });
    });

    describe('POST /password-reset/update-password/:token', () => {
        it('should call resetPassword and return 200', async () => {
            passwordResetController.resetPassword.mockImplementation((req, res) => res.status(200).json({ success: true }));
            const res = await request(app).post('/password-reset/update-password/some_token').send({ password: 'new_password' });
            expect(res.statusCode).toEqual(200);
            expect(passwordResetController.resetPassword).toHaveBeenCalled();
        });
    });
});
