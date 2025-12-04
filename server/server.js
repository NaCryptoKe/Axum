const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser'); // 👈 for reading cookies
const passport = require('passport');           // 👈 import passport
require('./controllers/authController');       // 👈 loads GoogleStrategy

const authRoutes = require('./routes/authRouter');
const passwordResetRoutes = require('./routes/passwordResetRouter');
const userRoute = require('./routes/userRoute');
const financeRoute = require('./routes/financialsRoute');
const debugRoute = require('./routes/debugRouter');
const adminRoute = require('./routes/adminRoute');
const organizationRoute = require('./routes/organizationRoute');
const gameRoute = require('./routes/gameRoute');
const log = require('./middlewares/logRoute');
const updateLastSeen = require('./middlewares/updateLastSeenMiddleware');

const app = express();

// ✅ CORS
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true, // allow cookies
}));

app.use(express.json());
app.use(cookieParser()); // must come before routes
app.use(log);
app.use(updateLastSeen);

// ✅ Initialize Passport
app.use(passport.initialize());

// ✅ Routes
app.use('/api/auth', authRoutes);
app.use('/api/password-reset', passwordResetRoutes);
app.use('/api', userRoute);
app.use('/api/finance', financeRoute);
app.use('/api/debug', debugRoute);
app.use('/api/admin', adminRoute);
app.use('/api/organization', organizationRoute);
app.use('/api/games', gameRoute);

app.get('/', (req, res) => {
    return res.status(200).json({
        success: true,
        message: 'Welcome to the server!',
        data: null,
        error: null
    });
});


// ✅ Start server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
