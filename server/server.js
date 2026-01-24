// --- Imports ---
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const passport = require('passport');
require('dotenv').config(); // Ensure env vars are loaded

// Imported for side-effect: loads the Google OAuth2 strategy for Passport.
require('./controllers/authController');

// --- Route Imports ---
const authRoutes = require('./routes/authRouter');
const passwordResetRoutes = require('./routes/passwordResetRouter');
const userRoute = require('./routes/userRoute');
const financeRoute = require('./routes/financialsRoute');
const debugRoute = require('./routes/debugRouter');
const adminRoute = require('./routes/adminRoute');
const organizationRoute = require('./routes/organizationRoute');
const gameRoute = require('./routes/gameRoute');
const communityRoute = require('./routes/communityRoute');
const socialRoute = require('./routes/socialRoute');
const publishingRoute = require('./routes/publishingRoute');
const notificationRoute = require('./routes/notificationRoute');
const analyticsRoute = require('./routes/analyticsRoute');

// --- Middleware Imports ---
// Ensure these files actually export a function (req, res, next)
const log = require('./middlewares/logRoute');
const updateLastSeen = require('./middlewares/updateLastSeenMiddleware');
const { successResponse } = require('./utils/responseHandler');

// --- Express App Initialization ---
const app = express();

// --- PRODUCTION SETTINGS (Must be after app init) ---
// This fixes the "X-Forwarded-For" and Rate Limit errors on Railway
app.set('trust proxy', 1);

// --- Core Middlewares ---
app.use(cors({
    // Allow both your Localhost AND your Deployed Frontend
    origin: [
        'http://localhost:5173',           // For local development
        'https://axum-arcade.vercel.app',
        process.env.FRONTEND_URL,           // For production (e.g., https://axumarcade.com)
    ],
    credentials: true, // Allow cookies/headers to be sent
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse incoming requests with JSON payloads.
app.use(express.json());

// Parse cookies (Must be before routes)
app.use(cookieParser());

// Custom Logging
app.use(log);

// Update 'last_seen' (Ensure this middleware handles errors gracefully)
app.use(updateLastSeen);

// --- Authentication Middleware ---
app.use(passport.initialize());

// --- API Routes ---
app.use('/api/auth', authRoutes);
app.use('/api/password-reset', passwordResetRoutes);
app.use('/api/users', userRoute);
app.use('/api/finance', financeRoute);
app.use('/api/debug', debugRoute);
app.use('/api/admin', adminRoute);
app.use('/api/organizations', organizationRoute);
app.use('/api/games', gameRoute);
app.use('/api/community', communityRoute);
app.use('/api/social', socialRoute);
app.use('/api/publishing', publishingRoute);
app.use('/api/notifications', notificationRoute);
app.use('/api/analytics', analyticsRoute);

// --- Root Endpoint ---
app.get('/health', (req, res) => {
    return successResponse(res, 'Server is healthy and running!');
});

// --- Server Startup ---
const PORT = process.env.PORT || 3000;

// Listen on 0.0.0.0 to ensure Railway/Docker can map the port correctly
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});