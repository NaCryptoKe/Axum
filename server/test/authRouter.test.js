const express = require('express');
const request = require('supertest');
const authRouter = require('../routes/authRouter');
const authController = require('../controllers/authController');
const emailVerificationController = require('../controllers/emailVerificationController');
const { rateLimiter } = require('../middlewares/rateLimiter');
const { checkCooldown } = require('../middlewares/checkCooldown');
const authenticateMiddleware = require('../middlewares/authenticateMiddleware');

jest.mock('../controllers/authController');
jest.mock('../controllers/emailVerificationController');
jest.mock('../middlewares/rateLimiter', () => ({
    rateLimiter: (req, res, next) => next()
}));
jest.mock('../middlewares/checkCooldown', () => ({
    checkCooldown: (req, res, next) => next()
}));
jest.mock('../middlewares/authenticateMiddleware', () => (req, res, next) => {
    req.user = { id: 'test_user_id' };
    next();
});

const app = express();
app.use(express.json());
app.use('/auth', authRouter);

describe('Auth Router', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /auth/', () => {
        it('should call healthCheck and return 200', async () => {
            authController.healthCheck.mockImplementation((req, res) => res.status(200).json({ success: true }));
            const res = await request(app).get('/auth/');
            expect(res.statusCode).toEqual(200);
            expect(authController.healthCheck).toHaveBeenCalled();
        });
    });

    describe('POST /auth/register', () => {
        it('should call register and return 201', async () => {
            authController.register.mockImplementation((req, res) => res.status(201).json({ success: true }));
            const res = await request(app).post('/auth/register').send({ username: 'test', password: 'password' });
            expect(res.statusCode).toEqual(201);
            expect(authController.register).toHaveBeenCalled();
        });
    });

    describe('POST /auth/login', () => {
        it('should call login and return 200', async () => {
            authController.login.mockImplementation((req, res) => res.status(200).json({ success: true }));
            const res = await request(app).post('/auth/login').send({ username: 'test', password: 'password' });
            expect(res.statusCode).toEqual(200);
            expect(authController.login).toHaveBeenCalled();
        });
    });

    describe('GET /auth/google', () => {
        it('should call google and return 200', async () => {
            authController.google.mockImplementation((req, res) => res.status(200).json({ success: true }));
            const res = await request(app).get('/auth/google');
            expect(res.statusCode).toEqual(200);
            expect(authController.google).toHaveBeenCalled();
        });
    });

    describe('GET /auth/google/callback', () => {
        it('should call googleCallback and return 200', async () => {
            authController.googleCallback.mockImplementation((req, res) => res.status(200).json({ success: true }));
            const res = await request(app).get('/auth/google/callback');
            expect(res.statusCode).toEqual(200);
            expect(authController.googleCallback).toHaveBeenCalled();
        });
    });

    describe('POST /auth/generate-otp', () => {
        it('should call generateOtp and return 200', async () => {
            emailVerificationController.generateOtp.mockImplementation((req, res) => res.status(200).json({ success: true }));
            const res = await request(app).post('/auth/generate-otp').send({ email: 'test@test.com' });
            expect(res.statusCode).toEqual(200);
            expect(emailVerificationController.generateOtp).toHaveBeenCalled();
        });
    });

    describe('POST /auth/verify-otp', () => {
        it('should call verifyOtp and return 200', async () => {
            emailVerificationController.verifyOtp.mockImplementation((req, res) => res.status(200).json({ success: true }));
            const res = await request(app).post('/auth/verify-otp').send({ email: 'test@test.com', otp: '123456' });
            expect(res.statusCode).toEqual(200);
            expect(emailVerificationController.verifyOtp).toHaveBeenCalled();
        });
    });

    describe('GET /auth/authenticate', () => {
        it('should call authenticate and return 200', async () => {
            authController.authenticate.mockImplementation((req, res) => res.status(200).json({ success: true }));
            const res = await request(app).get('/auth/authenticate');
            expect(res.statusCode).toEqual(200);
            expect(authController.authenticate).toHaveBeenCalled();
        });
    });

    describe('GET /auth/sessions', () => {
        it('should call getAllUsersSessions and return 200', async () => {
            authController.getAllUsersSessions.mockImplementation((req, res) => res.status(200).json({ success: true }));
            const res = await request(app).get('/auth/sessions');
            expect(res.statusCode).toEqual(200);
            expect(authController.getAllUsersSessions).toHaveBeenCalled();
        });
    });

    describe('DELETE /auth/sessions/:session_id', () => {
        it('should call deleteUserSession and return 200', async () => {
            authController.deleteUserSession.mockImplementation((req, res) => res.status(200).json({ success: true }));
            const res = await request(app).delete('/auth/sessions/1');
            expect(res.statusCode).toEqual(200);
            expect(authController.deleteUserSession).toHaveBeenCalled();
        });
    });

    describe('POST /auth/logout', () => {
        it('should call logout and return 200', async () => {
            authController.logout.mockImplementation((req, res) => res.status(200).json({ success: true }));
            const res = await request(app).post('/auth/logout');
            expect(res.statusCode).toEqual(200);
            expect(authController.logout).toHaveBeenCalled();
        });
    });
});
