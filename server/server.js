const express = require('express');
const session = require('express-session');
const bcrypt = require('bcrypt');
const app = express();
const port = 3000;

const user = require('./routes/userRoute');
const game = require('./routes/gameRoute');
const chat = require('./routes/chatRoute');
const payment = require('./routes/paymentRoute');
const search = require('./routes/searchRoute');
const admin = require('./routes/adminRoute');

app.use('/', user);
app.use('/game', game);
app.use('/chat', chat);
app.use('/payment', payment);
app.use('/search', search);
app.use('/admin', admin);

app.listen(port, () => {
    console.log(`Listening on port https://localhost:${port}`);
});
