const express = require('express');
const request = require('supertest');
const financialsRouter = require('../routes/financialsRoute');
const axios = require('axios');
const authenticateMiddleware = require('../middlewares/authenticateMiddleware');
const isVerifiedMiddleware = require('../middlewares/isVerifiedMiddleware');

jest.mock('axios');
jest.mock('../middlewares/authenticateMiddleware', () => (req, res, next) => {
    req.user = { id: 'test_user_id' };
    next();
});
jest.mock('../middlewares/isVerifiedMiddleware', () => (req, res, next) => next());

const app = express();
app.use(express.json());
app.use('/finance', financialsRouter);

describe('Financials Router', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('GET /finance/', () => {
        it('should return 200 with a success message', async () => {
            const res = await request(app).get('/finance/');
            expect(res.statusCode).toEqual(200);
            expect(res.text).toBe('PAYMENT WORKING');
        });
    });

    describe('POST /finance/pay', () => {
        it('should call Chapa API and return checkout URL', async () => {
            const chapaResponse = {
                data: {
                    data: {
                        checkout_url: 'https://checkout.chapa.co/checkout/payment/some_token'
                    }
                }
            };
            axios.post.mockResolvedValue(chapaResponse);
            const res = await request(app).post('/finance/pay').send({
                amount: 100,
                currency: 'ETB',
                email: 'test@test.com',
                first_name: 'Test',
                last_name: 'User'
            });
            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty('checkout_url');
            expect(axios.post).toHaveBeenCalled();
        });

        it('should return 500 on Chapa API failure', async () => {
            axios.post.mockRejectedValue(new Error('Payment failed'));
            const res = await request(app).post('/finance/pay').send({
                amount: 100,
                currency: 'ETB',
                email: 'test@test.com',
                first_name: 'Test',
                last_name: 'User'
            });
            expect(res.statusCode).toEqual(500);
        });
    });

    describe('GET /finance/verify-payment/:tx_ref', () => {
        it('should call Chapa verification API and return data', async () => {
            const verificationResponse = { data: { status: 'success' } };
            axios.get.mockResolvedValue(verificationResponse);
            const res = await request(app).get('/finance/verify-payment/tx-12345');
            expect(res.statusCode).toEqual(200);
            expect(res.body).toEqual({ status: 'success' });
            expect(axios.get).toHaveBeenCalled();
        });
        
        it('should return 500 on Chapa verification API failure', async () => {
            axios.get.mockRejectedValue(new Error('Verification failed'));
            const res = await request(app).get('/finance/verify-payment/tx-12345');
            expect(res.statusCode).toEqual(500);
        });
    });

    describe('GET /finance/payment-success', () => {
        it('should return a success message', async () => {
            const res = await request(app).get('/finance/payment-success');
            expect(res.statusCode).toEqual(200);
            expect(res.text).toBe('✅ Payment successful!');
        });
    });
});
