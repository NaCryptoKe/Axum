const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();

app.use(cookieParser());

// Set a cookie
app.get('/set', (req, res) => {
    res.cookie('theme', 'dark', { maxAge: 10000, httpOnly: true });
    res.send('Cookie has been set!');
});

// Read a cookie
app.get('/get', (req, res) => {
    const theme = req.cookies.theme;
    res.send(`Current theme: ${theme || 'not set'}`);
});

// Delete a cookie
app.get('/clear', (req, res) => {
    res.clearCookie('theme');
    res.send('Cookie cleared!');
});

app.listen(3000, () => {
    console.log('Express server started');
})