const { Pool } = require('pg');

const pool = new Pool ( {
    user: 'postgres',          // your Postgres username
    host: 'localhost',         // server host
    database: 'axum_arcade',   // database name
    password: 'maximus', // your password
    port: 5432,                // default Postgres port
} );

pool.connect()
    .then(() => console.log('Connected to PostgreSQL database!'))
    .catch(err => console.error('Connection error', err.stack));

module.exports = pool;