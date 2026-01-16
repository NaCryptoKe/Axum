// --- Imports ---
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const passport = require('passport');
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

// --- Middleware Imports ---
const log = require('./middlewares/logRoute');
const updateLastSeen = require('./middlewares/updateLastSeenMiddleware');

// --- Express App Initialization ---
const app = express();

// --- Core Middlewares ---
// Enable Cross-Origin Resource Sharing for requests from the frontend client.
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true, // Allow cookies to be sent from the client.
}));

// Parse incoming requests with JSON payloads.
app.use(express.json());
// Parse cookies from incoming requests. This must be placed before any routes that need access to cookies.
app.use(cookieParser());
// Log incoming requests to the console.
app.use(log);
// Update the 'last_seen' timestamp for the user on each request.
app.use(updateLastSeen);

// --- Authentication Middleware ---
// Initialize Passport to handle authentication strategies.
app.use(passport.initialize());

// --- API Routes ---
// Mount the different API route handlers on their respective paths.
app.use('/api/auth', authRoutes);
app.use('/api/password-reset', passwordResetRoutes);
app.use('/api/users', userRoute);
app.use('/api/finance', financeRoute);
app.use('/api/debug', debugRoute);
app.use('/api/admin', adminRoute);
app.use('/api/organizations', organizationRoute);
app.use('/api/games', gameRoute);

// --- Root Endpoint ---
// A simple health check endpoint to confirm the server is running.
app.get('/', (req, res) => {
    return res.status(200).json({
        success: true,
        message: 'Welcome to the server!',
        data: null,
        error: null
    });
});

// --- Server Startup ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
