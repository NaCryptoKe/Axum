const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',           // your Postgres username
    host: 'localhost',       // server host
    database: 'axum', // database name
    password: '1234',     // your password
    port: 1234,              // default Postgres port
});

module.exports = pool;
