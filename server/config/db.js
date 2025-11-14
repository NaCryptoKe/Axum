const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',           // your Postgres username
    host: 'localhost',       // server host
    database: 'axum', // database name
<<<<<<< HEAD
    password: '1234',     // your password
    port: 1234,              // default Postgres port
=======
    password: 'smaximus',     // your password
    port: 5432,              // default Postgres port
>>>>>>> aede0a05ca62f0af1947fc97fb44b4c31fddd62a
});

module.exports = pool;
