const express = require('express');
const request = require('supertest');
const debugRouter = require('../routes/debugRouter');
const debugController = require('../controllers/debugController');

jest.mock('../controllers/debugController');

const app = express();
app.use(express.json());
app.use('/debug', debugRouter);

describe('Debug Router', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /debug/stats', () => {
        it('should call getDebugStats and return 200', async () => {
            debugController.getDebugStats.mockImplementation((req, res) => res.status(200).json({ success: true }));
            const res = await request(app).get('/debug/stats');
            expect(res.statusCode).toEqual(200);
            expect(debugController.getDebugStats).toHaveBeenCalled();
        });
    });
});
