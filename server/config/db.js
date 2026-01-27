const { Pool } = require('pg');

// Configure the connection pool with your local credentials
const pool = new Pool({
  user: 'nahom',         // e.g., 'postgres'
  host: 'localhost',            // local machine
  database: 'axum', // e.g., 'mydatabase'
  password: 'maximus',     // e.g., 'postgres'
  port: 5432,                   // default Postgres port
});
// For local development, the Pool constructor will automatically use
// the standard PostgreSQL environment variables (PGHOST, PGUSER, PGDATABASE, PGPASSWORD, PGPORT)
// if they are present in .env or the environment.

module.exports = pool;