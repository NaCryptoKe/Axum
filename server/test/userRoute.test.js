const express = require('express');
const request = require('supertest');
const userRouter = require('../routes/userRoute');
const userController = require('../controllers/userController');
const organizationController = require('../controllers/organizationController');
const authenticateMiddleware = require('../middlewares/authenticateMiddleware');
const isVerifiedMiddleware = require('../middlewares/isVerifiedMiddleware');
const adminMiddleware = require('../middlewares/adminMiddleware');

jest.mock('../controllers/userController');
jest.mock('../controllers/organizationController');
jest.mock('../middlewares/authenticateMiddleware', () => (req, res, next) => {
    req.user = { id: 'test_user_id', username: 'testuser' };
    next();
});
jest.mock('../middlewares/isVerifiedMiddleware', () => (req, res, next) => next());
jest.mock('../middlewares/adminMiddleware', () => (req, res, next) => next());

const app = express();
app.use(express.json());
app.use('/users', userRouter);

describe('User Router', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /users/', () => {
        it('should return 200 with a success message', async () => {
            const res = await request(app).get('/users/');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual({
                success: true,
                message: 'USER WORKING',
                data: null,
                error: null
            });
        });
    });

    describe('GET /users/:userId/organizations', () => {
        it('should call getUserOrganizationsControl and return 200', async () => {
            organizationController.getUserOrganizationsControl.mockImplementation((req, res) => res.status(200).json({ success: true }));
            const res = await request(app).get('/users/1/organizations');
            expect(res.statusCode).toEqual(200);
            expect(organizationController.getUserOrganizationsControl).toHaveBeenCalled();
        });
    });

    describe('GET /users/@:username', () => {
        it('should call getUserProfile and return 200', async () => {
            userController.getUserProfile.mockImplementation((req, res) => res.status(200).json({ success: true }));
            const res = await request(app).get('/users/@testuser');
            expect(res.statusCode).toEqual(200);
            expect(userController.getUserProfile).toHaveBeenCalled();
        });
    });

    describe('DELETE /users/@:username', () => {
        it('should call softDelete and return 200', async () => {
            userController.softDelete.mockImplementation((req, res) => res.status(200).json({ success: true }));
            const res = await request(app).delete('/users/@testuser');
            expect(res.statusCode).toEqual(200);
            expect(userController.softDelete).toHaveBeenCalled();
        });
    });

    describe('GET /users/@:username/status', () => {
        it('should call onlineStatus and return 200', async () => {
            userController.onlineStatus.mockImplementation((req, res) => res.status(200).json({ success: true }));
            const res = await request(app).get('/users/@testuser/status');
            expect(res.statusCode).toEqual(200);
            expect(userController.onlineStatus).toHaveBeenCalled();
        });
    });

    describe('PATCH /users/@:username/update', () => {
        it('should call updateProfile and return 200', async () => {
            userController.updateProfile.mockImplementation((req, res) => res.status(200).json({ success: true }));
            const res = await request(app).patch('/users/@testuser/update').send({ bio: 'new bio' });
            expect(res.statusCode).toEqual(200);
            expect(userController.updateProfile).toHaveBeenCalled();
        });
    });

    describe('PATCH /users/@:username/update-profile-picture', () => {
        it('should call updateProfilePicture and return 200', async () => {
            userController.updateProfilePicture.mockImplementation((req, res) => res.status(200).json({ success: true }));
            const res = await request(app).patch('/users/@testuser/update-profile-picture').send({ picture: 'new_pic.jpg' });
            expect(res.statusCode).toEqual(200);
            expect(userController.updateProfilePicture).toHaveBeenCalled();
        });
    });

    describe('GET /users/active', () => {
        it('should call allActiveUsers and return 200', async () => {
            userController.allActiveUsers.mockImplementation((req, res) => res.status(200).json({ success: true }));
            const res = await request(app).get('/users/active');
            expect(res.statusCode).toEqual(200);
            expect(userController.allActiveUsers).toHaveBeenCalled();
        });
    });

    describe('Admin Routes', () => {
        describe('GET /users/admin/all', () => {
            it('should call allUsers and return 200', async () => {
                userController.allUsers.mockImplementation((req, res) => res.status(200).json({ success: true }));
                const res = await request(app).get('/users/admin/all');
                expect(res.statusCode).toEqual(200);
                expect(userController.allUsers).toHaveBeenCalled();
            });
        });

        describe('PATCH /users/admin/users/@:username/role', () => {
            it('should call changeUserRole and return 200', async () => {
                userController.changeUserRole.mockImplementation((req, res) => res.status(200).json({ success: true }));
                const res = await request(app).patch('/users/admin/users/@testuser/role').send({ role: 'admin' });
                expect(res.statusCode).toEqual(200);
                expect(userController.changeUserRole).toHaveBeenCalled();
            });
        });

        describe('DELETE /users/admin/users/@:username/permanent', () => {
            it('should call permanentDeleteUserController and return 200', async () => {
                userController.permanentDeleteUserController.mockImplementation((req, res) => res.status(200).json({ success: true }));
                const res = await request(app).delete('/users/admin/users/@testuser/permanent');
                expect(res.statusCode).toEqual(200);
                expect(userController.permanentDeleteUserController).toHaveBeenCalled();
            });
        });

        describe('PATCH /users/admin/users/@:username/undelete', () => {
            it('should call undeleteUserController and return 200', async () => {
                userController.undeleteUserController.mockImplementation((req, res) => res.status(200).json({ success: true }));
                const res = await request(app).patch('/users/admin/users/@testuser/undelete');
                expect(res.statusCode).toEqual(200);
                expect(userController.undeleteUserController).toHaveBeenCalled();
            });
        });
    });
});
