const db = require("./db");

exports.login = async (req, res) => {
    const { username, password } = req.body;
    const result = await db.query ("select * from users where username = $1 and password_hash = $2",
        [username, password]
        )
    return result.rows;
}

exports.register = async (req, res) => {
    const { username, email, password } = req.body;
    const result = await db.query("insert into users (username, email, password_hash) VALUES ($1, $2, $3)",
        [username, email, password])
    return result.rows;
}