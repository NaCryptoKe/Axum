const user = require('./user');


exports.login = async function (req, res) {
    try {
        const result = await user.login(req, res);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: error.message});
    }
};

exports.register = async function (req, res) {
    try {
        const result = await user.register(req, res);
        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: error.message});
    }
}
