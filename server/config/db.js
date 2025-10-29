const { Pool } = require('pg');

const pool = new Pool({
    user: 'nahom',           // your Postgres username
    host: 'localhost',       // server host
    database: 'axum_arcade', // database name
    password: 'maximus',     // your password
    port: 5432,              // default Postgres port
});

module.exports = pool;
