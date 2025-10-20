const db = require('../config/db');

exports.getAllUsers = async () => {
    const result = await db.query("select * from users");
    return result.rows;
}

exports.getUser = async (username) => {
    const result = await db.query('select * from users where username = $1',
        [username]);
    return result.rows;
}