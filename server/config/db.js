const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',           // your Postgres username
    host: 'localhost',       // server host
    database: 'axum', // database name
<<<<<<< Updated upstream
    password: '1234',     // your password
    port: 1234,              // default Postgres port
=======
    password: 'maximus',     // your password
    port: 5432,              // default Postgres port
>>>>>>> Stashed changes
});

module.exports = pool;
