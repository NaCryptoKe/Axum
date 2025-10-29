const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser'); // 👈 import it
const authRoutes = require('./routes/authRouter');
const log = require('./middlewares/logRoute')

const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true // allow cookies
}));

app.use(express.json());
app.use(cookieParser()); // 👈 must come before routes
app.use(log);

app.use('/api/auth', authRoutes);
app.get('/', (req, res) => {
    res.send('Welcome to the server!');
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
