const { Pool } = require("pg");

const pool = new Pool({
    user: process.env.PGUSER,
    password: process.env.PGPWD,
    port: process.env.PGPORT ?? 5432,
    database: process.env.PGDB,
    host: process.env.PGHOST,
    max: 20,
    idleTimeoutMillis: 2*1000,
    connectionTimeoutMillis: 10*1000,
    allowExitOnIdle: true
});

module.exports = pool;