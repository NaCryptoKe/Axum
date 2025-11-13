const { Pool } = require('pg');

const pool = new Pool({
    user: 'nahom',           // your Postgres username
    host: 'localhost',       // server host
    database: 'axum', // database name
    password: 'smaximus',     // your password
    port: 5432,              // default Postgres port
});

module.exports = pool;
