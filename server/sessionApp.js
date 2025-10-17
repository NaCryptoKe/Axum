const express = require('express');
const session = require('express-session');

const app = express();

app.use(express.json());

app.use(session({
    secret: 'my secret',
    resave: false, // don't resave if nothing changed
    saveUninitialized: true, // don't save empty sessions
    cookie: { maxAge: 60 * 60 * 1000 }, // optional expires in one hour
}))

app.post('/login', (req, res) => {
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({ error: 'Username required' });
    }

    req.session.username = username;
    res.json({message: `${username} stored in session`});
})

app.get('/dashboard', (req, res) => {
    if (req.session.username) {
        res.send (`Welcome back ${req.session.username}`);
    } else {
        res.status(403).send("Access denied");
    }
})

app.listen(3000, () => {
    console.log("Server started on port 3000");
})