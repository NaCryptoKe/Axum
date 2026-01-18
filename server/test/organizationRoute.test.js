const express = require('express');
const request = require('supertest');
const organizationRouter = require('../routes/organizationRoute');
const organizationController = require('../controllers/organizationController');

jest.mock('../controllers/organizationController');

const app = express();
app.use(express.json());
app.use('/org', organizationRouter);

describe('Organization Router', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /org/', () => {
        it('should call healthCheck and return 200', async () => {
            organizationController.healthCheck.mockImplementation((req, res) => res.status(200).json({ success: true }));
            const res = await request(app).get('/org/');
            expect(res.statusCode).toEqual(200);
            expect(organizationController.healthCheck).toHaveBeenCalled();
        });
    });

    describe('GET /org/user/:userId', () => {
        it('should call getUserOrganizationsControl and return 200', async () => {
            organizationController.getUserOrganizationsControl.mockImplementation((req, res) => res.status(200).json({ success: true }));
            const res = await request(app).get('/org/user/1');
            expect(res.statusCode).toEqual(200);
            expect(organizationController.getUserOrganizationsControl).toHaveBeenCalled();
        });
    });
});
