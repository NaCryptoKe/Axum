const express = require('express');
const router = express.Router();
const fs = require('node:fs/promises');

router.post('/', async (req, res) => {
    const { username, email } = req.body;

    if (!username || !email) {
        return res.status(400).json({ error: "Username and email are required" });
    }

    let storedData = [];

    try {
        const data = await fs.readFile('users.json', 'utf8');
        storedData = JSON.parse(data);
    } catch (err) {
        // if file doesn't exist, start with empty array
        if (err.code !== 'ENOENT') {
            console.error('Error reading file:', err);
            return res.status(500).json({ error: "Error reading users file" });
        }
    }

    // 🔍 Check if username already exists
    const userExists = storedData.some(user => user.username === username);
    if (userExists) {
        return res.status(400).json({ error: "Username already exists" });
    }

    const id = storedData.length + 1;
    const newUser = { id, username, email };
    storedData.push(newUser);

    try {
        await fs.writeFile('users.json', JSON.stringify(storedData, null, 2), 'utf8');
    } catch (err) {
        console.error('Error writing file:', err);
        return res.status(500).json({ error: "Could not save user" });
    }

    res.json({
        message: 'User created successfully!',
        userCount: storedData.length,
        user: newUser
    });
});

router.get('/', async(req, res) => {
    const data = await fs.readFile('users.json', 'utf8');
    let users = JSON.parse(data);
    res.json(users);
});

router.get('/:id', async (req, res, next) => {
    try {
        const id = parseInt(req.params.id);

        const data = await fs.readFile('users.json', 'utf8');
        let users = JSON.parse(data);

        const user = users.find(user => user.id === id);
        if (!user) throw new Error('User not found');
        res.json(user)
    } catch (err) {
        next(err);
    }
});

module.exports = router;