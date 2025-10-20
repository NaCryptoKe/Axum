const userModel = require('../model/userModel');

exports.getAllUsers = async function (req, res) {
    try {
        const result = await userModel.getAllUsers();
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: error.message});
    }
}

exports.getUser = async function (req, res) {
    try {
        const { username } = req.params;
        const user = await userModel.getUser(username);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
}